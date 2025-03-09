import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:9091/tasks'; 

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setInProgress(id: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/inProgress`, {});
  }

  setCompleted(id: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/completed`, {});
  }
  archiveTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/archived`, {});
  }
  
  unarchiveTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/unarchived`, {});
  }
  updateTaskStatus(id: string, newStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: newStatus });
  }

  // Récupérer les tâches d'un projet
  //getTasksByProject(projectId: string): Observable<any> {
   // return this.http.get(`${this.apiUrl}/project/${projectId}`);
  //}
  
}
