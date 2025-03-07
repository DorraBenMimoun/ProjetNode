import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9091/users';

  constructor(private http: HttpClient) {}

  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userData);
  }
  
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
  
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/`);
  }
  
  updatePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, passwordData);
  }
}
