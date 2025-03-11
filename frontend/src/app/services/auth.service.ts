import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9091/users';
 // Un BehaviorSubject pour suivre l'état de la connexion
  isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  constructor(private http: HttpClient) {}

  onSignup(userData: any): Observable<any> {
    console.log("data",userData);
    
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    console.log("credentials",credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials);

  }

  saveToken(token: string, userId:string): void {
    this.isLoggedInSubject.next(true);  // Émet que l'utilisateur est maintenant connecté

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }



  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId')
    this.isLoggedInSubject.next(false);  // Émet que l'utilisateur est maintenant déconnecté

  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
      return !!localStorage.getItem('token');
    }

      // Méthode pour obtenir l'état de la connexion
  getIsLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, {  newPassword });
  }
}
