import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Secretaria } from '../models/secretaria.model';

@Injectable({
  providedIn: 'root',
})
export class SecretariaService {
  private apiUrl = 'api/v1/docentes'; // URL del backend

  constructor(private http: HttpClient) {}

  list(): Observable<Secretaria[]> {
    return this.http.get<Secretaria[]>(this.apiUrl);
  }

  create(teacher: Secretaria): Observable<Secretaria> {
    this.buscarPorId(teacher);
    return this.http.post<Secretaria>(this.apiUrl, teacher);
  }

  update(id: number, teacher: Secretaria): Observable<Secretaria> {
    this.buscarPorId(teacher);
    return this.http.put<Secretaria>(`${this.apiUrl}/${id}`, teacher);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método privado para mapear IDs a objetos
  private buscarPorId(teacher: Secretaria): void {
    
  }
}
