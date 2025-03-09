import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) { }

  // Realiza la petición de login
  login(numeroDocumento: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('numeroDocumento', numeroDocumento);
    body.set('password', password);
    
    return this.http.post(this.apiUrl, body.toString(), { headers });
  }

  // Maneja el logout
  logout() {
    localStorage.removeItem('authToken');
    this.authStatus.next(false); // Cambia el estado de autenticación
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Obtiene el estado de autenticación
  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  // Actualiza el estado de autenticación
  updateAuthStatus(status: boolean) {
    this.authStatus.next(status);
  }
}


