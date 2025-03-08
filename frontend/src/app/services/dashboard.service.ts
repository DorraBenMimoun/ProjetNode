import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrlTasks = 'http://localhost:9091/tasks'; 
  private apiUrlProject = 'http://localhost:9091/projects'; 

  constructor(private http: HttpClient) { }


  getTaskStatusDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrlTasks}/status/Distribution`);
  }

  getTaskCreationEvolution(): Observable<any> {
    return this.http.get(`${this.apiUrlTasks}/creation/evolution`);
  }

  getAverageCompletionTime(): Observable<any> {
    return this.http.get(`${this.apiUrlTasks}/completion/average`);
  }
  getTotalTasksCount(): Observable<any> {
    return this.http.get(`${this.apiUrlTasks}/count/total`);
  }
  getTotalProjectsCount(): Observable<any> {
    return this.http.get(`${this.apiUrlProject}/count/total`);
  }
  getTotalCollaboratorsCount(): Observable<any> {
    return this.http.get(`${this.apiUrlProject}/collaborators/count`);
  }
}
