import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse, Usuario } from './models/servicedesk.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'sd_jwt_token';
  private readonly USER_KEY = 'sd_usuario';

  usuarioActual = signal<Usuario | null>(this.leerUsuarioGuardado());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
        this.usuarioActual.set(res.usuario);
      })
    );
  }

  actualizarUsuarioLocal(usuario: Usuario): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.usuarioActual.set(usuario);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.usuarioActual();
  }

  debeCambiarPassword(): boolean {
    return !!this.usuarioActual()?.debeCambiarPassword;
  }

  esJefe(): boolean {
    return this.usuarioActual()?.rol === 'JEFE_TI';
  }

  esSoporteOJefe(): boolean {
    const rol = this.usuarioActual()?.rol;
    return rol === 'SOPORTE_TI' || rol === 'JEFE_TI';
  }

  private leerUsuarioGuardado(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}