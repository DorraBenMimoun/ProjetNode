import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

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
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrlTasks);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrlTasks}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrlTasks, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.http.put<Task>(`${this.apiUrlTasks}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlTasks}/${id}`);
  }

  setInProgress(id: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrlTasks}/${id}/inProgress`, {});
  }

  setCompleted(id: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrlTasks}/${id}/completed`, {});
  }
  archiveTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrlTasks}/${id}/archived`, {});
  }
  
  unarchiveTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrlTasks}/${id}/unarchived`, {});
  }
  updateTaskStatus(id: string, newStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrlTasks}/${id}/status`, { status: newStatus });
  }

  refreshTasks(): void {
    this.getTasks(); 
  }
    
  }
    

