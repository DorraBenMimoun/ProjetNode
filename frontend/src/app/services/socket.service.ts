// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  connect(): void {
    this.socket = io("http://localhost:9091", {
      query: { token: localStorage.getItem('token') },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected with socket ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
    });
  }

  // 🔄 On "welcome" (user socket)
  onWelcome(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('welcome', (message: string) => {
        observer.next(message);
      });
    });
  }



  // ➕ Envoyer une consultation de projet
  consultProject(projectId: string): void {
    this.socket.emit('consult-project', { projectId });
  }

  // 📥 Ecouter le message de confirmation de connexion au projet
  onConnectedToProject(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('connected-project', (msg: string) => {
        observer.next(msg);
      });
    });
  }

  // 🔔 Ecouter les mises à jour du projet
  onUpdateProject(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('update-project', (updatedProject, message, emetter) => {
        const infos  = {
          updatedProject,
          message,
          emetter
        };
        observer.next(infos);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
