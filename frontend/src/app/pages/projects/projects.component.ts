import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] =  [
    {
      _id: '1',
      name: 'Projet Alpha',
      description: 'Un projet de test pour la gestion des tâches',
    },
    {
      _id: '2',
      name: 'Projet Beta',
      description: 'Deuxième projet avec plusieurs membres',
    },
    {
      _id: '3',
      name: 'Projet Gamma',
      description: 'Un projet en développement',
    }
  ];
  
  
  showModal = false;
  editingProject: any = null;
  projectData = { name: '', description: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<any[]>('/api/projects').subscribe(data => {
      this.projects = data;
    });
  }

  openProjectModal(project: any = null) {
    this.editingProject = project;
    this.projectData = project ? { ...project } : { name: '', description: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingProject = null;
  }

  saveProject() {
    if (this.editingProject) {
      this.http.put(`/api/projects/${this.editingProject._id}`, this.projectData).subscribe(() => {
        this.loadProjects();
        this.closeModal();
      });
    } else {
      this.http.post('/api/projects', this.projectData).subscribe(() => {
        this.loadProjects();
        this.closeModal();
      });
    }
  }

  deleteProject(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.http.delete(`/api/projects/${id}`).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}
