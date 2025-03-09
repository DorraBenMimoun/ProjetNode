import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
  showAddTaskForm: boolean = false; 
  selectedProject: string | null = null;

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
     this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;  
      this.filterTasks();   
    });

    this.taskService.getTasks();
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


  selectProject(projectId: string) {
    console.log("📌 Projet sélectionné :", projectId);
    this.selectedProject = projectId;
    this.filterTasks(); 
  }

  filterTasks() {
    if (!this.selectedProject) {
      this.taskColumns = { TO_DO: [], DOING: [], DONE: [] }; 
      return;
    }
  
    const filteredTasks = this.tasks.filter(task => task.project === this.selectedProject);
  
    this.taskColumns = {
      TO_DO: filteredTasks.filter(task => task.status === "TO_DO"),
      DOING: filteredTasks.filter(task => task.status === "DOING"),
      DONE: filteredTasks.filter(task => task.status === "DONE")
    };
  }

  addTask(): void {
    if (!this.newTask.title.trim() || !this.selectedProject) {
      console.error("❌ Erreur : Titre ou projet invalide !");
      return;
    }
  
    const taskToSend = { 
      ...this.newTask, 
      projectId: this.selectedProject, // 🔥 Associer au projet sélectionné
      status: 'TO_DO' as 'TO_DO' 
    };
  
    this.taskService.createTask(taskToSend).subscribe({
      next: (task) => {
        console.log("Tâche ajoutée :", task);
  
        this.taskColumns['TO_DO'].push(task);
  
        this.taskService.refreshTasks();
        this.showAddTaskForm = false;
        this.newTask = { 
          title: '', 
          description: '',
           project: '', 
           status: 'TO_DO' as 'TO_DO' ,
           createdBy: "user-id", 
           archived: false};
      },
      error: (error) => console.error(" Erreur lors de l'ajout", error)
    });
  }
  
  
  
   loadProjects() {
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects;
      },
      (error) => {
        console.error("Erreur lors du chargement des projets :", error);
      }
    );
  }


  loadTasksForProject(projectId: string) {
    this.projectService.getTasksByProjectId(projectId).subscribe(
      (tasks) => {
        console.log('Tâches récupérées:', tasks);
        this.organizeTasks(tasks);
      },
      (error) => {
        console.error("Erreur lors du chargement des tâches :", error);
      }
    );
  }


  organizeTasks(tasks: Task[]) {
    this.taskColumns = { 'To Do': [], 'Doing': [], 'Done': [] };
    tasks.forEach(task => {
      const normalizedStatus = task.status.toUpperCase();
      if (normalizedStatus === 'TO_DO') {
        this.taskColumns['To Do'].push(task);
      } else if (normalizedStatus === 'DOING') {
        this.taskColumns['Doing'].push(task);
      } else if (normalizedStatus === 'DONE') {
        this.taskColumns['Done'].push(task);
      } else {
        console.warn('Tâche avec statut inconnu:', task);
      }
    });
  }

  
  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== id);
        this.tasks.push();
        this.filterTasks();
        this.taskService.refreshTasks();
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
      const newStatus = event.container.id as Task['status'];
      console.log("📤 Mise à jour API :", task._id, { status: newStatus });
  
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      // Appel API pour sauvegarder le changement
      this.taskService.updateTask(task._id!, { status: newStatus }).subscribe({
        next: (updatedTask) => {
          console.log("✅ Statut mis à jour dans la base :", updatedTask);
  
          this.updateTaskInList(updatedTask);
  
          this.filterTasks();
          this.taskService.refreshTasks();

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
      this.taskService.refreshTasks();

    }
  }
  
  updateTaskInList(updatedTask: Task): void {
    // Recherche la tâche dans la colonne appropriée (TO_DO, DOING, DONE)
    for (const status of this.statuses) {
      const column = this.taskColumns[status];
      const index = column.findIndex(task => task._id === updatedTask._id);
      
      if (index !== -1) {
        column[index] = updatedTask; // Remplacer la tâche dans la colonne
        break; // Terminer la boucle dès qu'on trouve et met à jour la tâche
      }
    }
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
        this.taskService.refreshTasks();
      },
      error: (error) => console.error('Erreur lors de l\'archivage', error)
    });
  }
  
  unarchiveTask(id: string): void {
    this.taskService.unarchiveTask(id).subscribe({
      next: (updatedTask) => {
        this.updateTaskInList(updatedTask);
        this.filterTasks();
        this.taskService.refreshTasks();
      },
      error: (error) => console.error('Erreur lors du désarchivage', error)
    });
  }
 
  

  
}
