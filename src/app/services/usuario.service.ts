import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  RegistroUsuarioRequest,
  Usuario
} from '../models/servicedesk.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  registrarColaborador(payload: RegistroUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/auth/register`, payload);
  }

  cambiarPassword(passwordActual: string, nuevaPassword: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/auth/cambiar-password`, { passwordActual, nuevaPassword });
  }

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  crearPorAdmin(payload: CrearUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, payload);
  }

  actualizarUsuario(id: number, payload: ActualizarUsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, payload);
  }

  alternarEstado(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/usuarios/${id}/estado`, {});
  }
}