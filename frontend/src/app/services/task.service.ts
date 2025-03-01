import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  doneBy?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:9091/tasks/g';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(title: string, description: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title, description });
  }

  updateTask(id: string, title: string, description: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { title, description });
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  setTaskInProgress(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/in-progress`, {});
  }

  setTaskCompleted(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/completed`, {});
  }
}
