import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:9091/comments';
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$: Observable<Comment[]> = this.commentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔶 Récupérer les commentaires d'une tâche
  getCommentsByTask(taskId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${taskId}`);
  }

  // 🔶 Ajouter un commentaire à une tâche
  addComment(taskId: string, text: string): Observable<any> {
    return this.http.post<Comment>(`${this.apiUrl}/${taskId}`, { text });
  }

  // 🔶 Supprimer un commentaire
  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }

}
