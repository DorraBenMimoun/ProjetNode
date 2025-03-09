import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Project {
  _id?: string;
  name: string;
  description?: string;
  owner?: string;
  members?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:9091/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  

  addMember(projectId: string, memberEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/addMember`, { email: memberEmail });
  }
  

  removeMember(projectId: string, email: string): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/${projectId}/removeMember`, { email :email});
  }
  archiveProject(projectId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/archive`, {});
  }

  unarchiveProject(projectId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/unarchive`, {});
  }
  getTasksByProjectId(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${projectId}/tasks`);
}

}