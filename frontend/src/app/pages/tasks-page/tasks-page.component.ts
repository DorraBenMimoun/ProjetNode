// src/app/components/tasks-page/tasks-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit {
  selectedProjectId: string | null = null;
  projects: Project[] = [];
  selectedProjectName: string = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => console.error("Erreur projets", err)
    });
  }

  onProjectSelected(projectId: string) {
    this.selectedProjectId = projectId;
    this.selectedProjectName = this.projects.find(p => p._id === projectId)?.name || '';
  }
}
