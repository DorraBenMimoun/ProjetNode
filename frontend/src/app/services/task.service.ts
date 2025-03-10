import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:9091/tasks'; 
  private tasksSubject = new BehaviorSubject<Task[]>([]);  // Bien typé ici
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();  // `tasks$` est un Observable<Task[]>
  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<any> {
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
    return this.http.post<Task>(`${this.apiUrl}/${id}/archive`, {});
  }
  
  unarchiveTask(id: string): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${id}/unarchive`, {});
  }
  updateTaskStatus(id: string, newStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: newStatus });
  }

  refreshTasks(): void {
    this.getTasks(); 
  }
  
}
