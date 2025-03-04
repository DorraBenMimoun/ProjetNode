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
  private baseUrl = 'http://localhost:9091/tasks'; // Remplace par l’URL de ton backend

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.baseUrl, task);
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  setTaskInProgress(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/inProgress`, {});
  }

  setTaskCompleted(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/completed`, {});
  }

  archiveTask(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/archive`, {});
  }

  unarchiveTask(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/unarchive`, {});
  }

  getArchivedTasks(projectId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/archived/${projectId}`);
  }
}