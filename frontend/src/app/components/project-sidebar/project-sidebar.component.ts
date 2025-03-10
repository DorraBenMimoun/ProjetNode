// src/app/components/project-sidebar/project-sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.css']
})
export class ProjectSidebarComponent {
  @Input() projects: Project[] = [];
  @Output() projectSelected = new EventEmitter<string>();

  selectProject(id: string) {
    this.projectSelected.emit(id);
  }
}
