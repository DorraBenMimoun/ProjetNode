import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  projects: any[] = [];
  newTask: Task = {
    title: '',
    description: '',
    status: 'TO_DO',
    archived: false,
    createdBy: '',
    project: '',
    checklist: [],
    comments: []
  };
  

  statuses = ['TO_DO', 'DOING', 'DONE'];
  taskColumns: { [key: string]: Task[] } = { 
    TO_DO: [], 
    DOING: [], 
    DONE: [] 
  };

  constructor(private taskService: TaskService, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getTasks();
    this.getProjects();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.filterTasks();
      },
      error: (error) => console.error('Erreur lors de la récupération des tâches', error)
    });
  }



  filterTasks(): void {
    this.taskColumns = { TO_DO: [], DOING: [], DONE: [] };
    this.tasks.forEach(task => {
      if (!task.archived) {
        this.taskColumns[task.status].push(task);
      }
    });
  }

  addTask(): void {
    console.log("🔵 addTask() appelée avec :", this.newTask); // 🟢 TEST
  
    if (!this.newTask.title.trim() || !this.newTask.project.trim()) {
      console.error("❌ Erreur : Titre ou projet invalide !");
      return;
    }
  
    const taskToSend = { 
      ...this.newTask, 
      projectId: this.newTask.project // Renomme `project` en `projectId`
    };
  
    console.log("📌 Données envoyées :", taskToSend); // 🟢 TEST
  
    this.taskService.createTask(taskToSend).subscribe({
      next: (task) => {
        console.log("✅ Tâche ajoutée avec succès :", task);
        this.tasks.push(task);
        this.filterTasks();
        this.resetNewTask();
      },
      error: (error) => console.error("❌ Erreur lors de l'ajout de la tâche", error)
    });
  }
  
  
  
  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== id);
        this.filterTasks();
      },
      error: (error) => console.error('Erreur lors de la suppression de la tâche', error)
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    console.log("🔄 Drag & Drop Event:", event);
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      console.log("📤 Mise à jour API :", task._id, { status: event.container.id });
  
      // Mise à jour locale immédiate
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      // Appel API pour sauvegarder le changement
      this.taskService.updateTask(task._id!, { status: event.container.id as Task['status'] }).subscribe({
        next: (updatedTask) => {
          console.log("✅ Statut mis à jour dans la base :", updatedTask);
          this.updateTaskInList(updatedTask);
  
          // 🔄 Rafraîchir la liste des tâches après mise à jour
          this.getTasks();
        },
        error: (error) => {
          console.error("❌ Erreur lors du changement de statut", error);
  
          // Restaurer la tâche à son état initial si erreur
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        }
      });
    }
  }
  
  
  
  
  
  
  
  

  updateTaskInList(updatedTask: Task): void {
    const index = this.tasks.findIndex((task) => task._id === updatedTask._id);
    if (index !== -1) {
      this.tasks[index] = updatedTask; // Remplace la tâche mise à jour dans la liste
    }
  }
  

  private resetNewTask(): void {
    this.newTask = { 
      title: '', 
      description: '', 
      status: 'TO_DO', 
      archived: false, 
      createdBy: '', 
      project: '', 
      checklist: [], 
      comments: [] 
    };
  }
  
  getProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        console.log("📌 Projets récupérés :", data); // 🟢 TEST
        this.projects = data;
      },
      error: (error) => console.error('Erreur lors de la récupération des projets', error)
    });
  }
  archiveTask(id: string): void {
    this.taskService.archiveTask(id).subscribe({
      next: (updatedTask) => {
        this.updateTaskInList(updatedTask);
        this.filterTasks();
      },
      error: (error) => console.error('Erreur lors de l\'archivage', error)
    });
  }
  
  unarchiveTask(id: string): void {
    this.taskService.unarchiveTask(id).subscribe({
      next: (updatedTask) => {
        this.updateTaskInList(updatedTask);
        this.filterTasks();
      },
      error: (error) => console.error('Erreur lors du désarchivage', error)
    });
  }
  
}
