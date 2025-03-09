import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../services/project.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';

interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: string;
  project: string; 
  createdBy: string;  // Utilisateur qui a créé la tâche
  archived?: boolean;  // Si la tâche est archivée ou non
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  selectedProject: any = null;  // Projet sélectionné pour afficher ses tâches
    newTask = { title: '', description: '', status: 'To Do' };
  statuses = ['To Do', 'Doing', 'Done'];
  taskColumns: { [key: string]: any[] } = {
    'To Do': [],
    'Doing': [],
    'Done': []
  };
  draggedTask: any = null;

  @Input() projectId: string = ''; // Récupère l'ID du projet sélectionné
  constructor(private projectService: ProjectService, private taskService: TaskService) {}

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
    });
  }

  selectProject(project: string) {
    console.log('Projet sélectionné:', project);  // Vérifiez si le projet est bien sélectionné
    this.selectedProject = project;
  }


  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      console.log('Projets récupérés:', projects);  // Vérifiez ici si vous obtenez bien les projets

      this.projects = projects;
    });
  }

  // Ajouter une nouvelle tâche
  addTask() {
    if (this.newTask.title.trim() && this.selectedProject) {
      const taskToAdd: Task = {
        ...this.newTask,
        project: this.selectedProject,
        createdBy: "USER_ID", // Remplace par l'ID réel
        archived: false
      };


    }
  }
  // Drag & Drop - Changer le statut d'une tâche
  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.status = newStatus;
      this.taskService.updateTaskStatus(task._id as string, newStatus).subscribe(() => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      });
    }
  }
}