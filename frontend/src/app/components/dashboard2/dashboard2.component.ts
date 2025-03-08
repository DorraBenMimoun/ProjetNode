import { ProjectService } from './../../services/project.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.css'
})
export class Dashboard2Component implements OnInit {
  taskStatusData: any[] = [];
  taskEvolutionData: any[] = [];
  avgCompletionTime: string = '';

  totalProjects = 0; 
  totalTasks = 0;
  totalCollaborators = 0; 
  listProjects: any[] = [];

  constructor(private dashboardService: DashboardService,private cdr: ChangeDetectorRef,private projectService:ProjectService) {}
  
  ngOnInit() {
    this.fetchTaskStatus();
    //this.fetchTaskEvolution();
    this.fetchCompletionTime();
    this.fetchProjects();
    console.log("listProjects", this.listProjects);
    this.dashboardService.getTotalTasksCount().subscribe(count => this.totalTasks = count.totalTasks);
    this.dashboardService.getTotalProjectsCount().subscribe(count => this.totalProjects = count.totalProjects);
    this.dashboardService.getTotalCollaboratorsCount().subscribe(count => this.totalCollaborators = count.totalCollaborators);
  }

  fetchProjects() {
    this.projectService.getProjects().subscribe((data) => {
      console.log("projects list data", data);
      if (data && Array.isArray(data)) {
        this.listProjects = data.map(project => ({
          id: project._id,
          name: project.name
        }));
      } else {
        this.listProjects = [];
      }
    }, (error) => {
      console.error("Erreur récupération ProjectsList", error);
      this.listProjects = [];
    });
  }
  fetchTaskStatus() {
    this.dashboardService.getTaskStatusDistribution().subscribe((data) => {
      console.log("tasks status data", data.TO_DO);
      if (data) {
        this.taskStatusData = [
          { name: 'To Do', value: data.TO_DO ?? 0 },
          { name: 'Doing', value: data.DOING ?? 0 },
          { name: 'Done', value: data.DONE ?? 0 },
        ];
      } else {
        this.taskStatusData = [];
      }

      console.log("tasks status data", this.taskStatusData);
    }, (error) => {
      console.error("Erreur récupération TaskStatus", error);
      this.taskStatusData = [];
    });
  }
  
  fetchTaskEvolution() {
    this.dashboardService.getTaskCreationEvolution().subscribe((data) => {
      console.log("Raw tasks evolution data", data);
  
      if (data && typeof data === 'object') {
        // Extraire les dates existantes
        let existingDates = Object.keys(data).map(dateStr => new Date(dateStr));
  
        // Trouver la plage de dates (30 derniers jours)
        let today = new Date();
        let startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
  
        // Générer toutes les dates entre startDate et today
        let allDates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= today) {
          allDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        // Construire le tableau des données pour ngx-charts
        this.taskEvolutionData = [
          {
            name: "Tâches créées", // Légende de la courbe
            series: allDates.map(date => {
              let dateString = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
              return {
                name: date.toLocaleDateString('fr-FR'), // Format JJ/MM/AAAA
                value: data[dateString] || 0 // Nombre de tâches créées ce jour-là
              };
            })
          }
        ];
  
        console.log("Formatted taskEvolutionData for chart:", this.taskEvolutionData);
      } else {
        this.taskEvolutionData = [];
      }
    }, (error) => {
      console.error("Erreur récupération TaskEvolution", error);
      this.taskEvolutionData = [];
    });
  }
  
  
  fetchCompletionTime() {
    this.dashboardService.getAverageCompletionTime().subscribe((data) => {
      console.log("average completion time", data);
      this.avgCompletionTime = data?.averageCompletionTime ? `${data.averageCompletionTime} jours` : "Non disponible";
    }, (error) => {
      console.error("Erreur récupération CompletionTime", error);
      this.avgCompletionTime = "Non disponible";
    });
  }
  
 
  
}