import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  projects: any[] = [];
  showTaskForm: boolean = false;

  selectedProject: string | null = null;
  newTask: Task = {
    _id:'',
    title: '',
    description: '',
    status: 'TO_DO',
    archived: false,
    createdBy: '',
    project: ''
  };  
  statuses = ['To Do', 'Doing', 'Done'];
  taskColumns: { [key: string]: Task[] } = { 'To Do': [], 'Doing': [], 'Done': [] };
  toggleTaskForm() {
    this.showTaskForm = !this.showTaskForm;
}
  constructor(private projectService: ProjectService, private taskService: TaskService) {}

  ngOnInit() {
    this.getTasks();
    this.loadProjects();
  }
  getTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;

        
      },
      error: (error) => console.error('Erreur lors de la récupération des tâches', error)
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
      projectId: this.newTask.project 
    };
  
    console.log("📌 Données envoyées :", taskToSend); // 🟢 TEST
  
    this.taskService.createTask(taskToSend).subscribe({
      next: (task) => {
        console.log("✅ Tâche ajoutée avec succès :", task);
        this.tasks.push(task);
        this.taskService.refreshTasks();
      },
      error: (error) => console.error("❌ Erreur lors de l'ajout de la tâche", error)
    });
  }
  
  // Charger les projets
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

  // Sélectionner un projet et charger ses tâches
  selectProject(projectId: string) {
    console.log('Projet sélectionné:', projectId);
    this.selectedProject = projectId;
    this.loadTasksForProject(projectId);
  }

  // Charger les tâches du projet sélectionné
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
  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== id);
        this.tasks.push();
        this.taskService.refreshTasks();
      },
      error: (error) => console.error('Erreur lors de la suppression de la tâche', error)
    });
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



  drop(event: CdkDragDrop<Task[]>): void {
    console.log("🔄 Drag & Drop Event:", event);
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as "TO_DO" | "DOING" | "DONE";
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
          column[index] = updatedTask; 
          break; 
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
}
