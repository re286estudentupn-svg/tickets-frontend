import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardMetrics,
  EstadoTicket,
  NuevoTicketRequest,
  PrioridadTicket,
  Ticket,
  Usuario
} from '../models/servicedesk.models';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  obtenerDashboard(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard`);
  }

  listarTickets(filtros?: {
    buscar?: string;
    categoria?: string;
    prioridad?: string;
    estado?: string;
    soloAsignados?: boolean;
    soloSinAsignar?: boolean;
  }): Observable<Ticket[]> {
    let params = new HttpParams();
    if (filtros?.buscar?.trim()) params = params.set('buscar', filtros.buscar.trim());
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.prioridad) params = params.set('prioridad', filtros.prioridad);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.soloAsignados) params = params.set('soloAsignados', 'true');
    if (filtros?.soloSinAsignar) params = params.set('soloSinAsignar', 'true');

    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, { params });
  }

  obtenerDetalle(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  crearTicket(payload: NuevoTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, payload);
  }

  tomarTicket(id: number): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/tomar`, {});
  }

  actualizarPrioridad(id: number, prioridad: PrioridadTicket, comentario: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/prioridad`, { prioridad, comentario });
  }

  actualizarEstado(id: number, estado: EstadoTicket, comentario: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/estado`, { estado, comentario });
  }

  asignarEspecialista(id: number, tecnicoId: number, comentario: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/asignar`, { tecnicoId, comentario });
  }

  agregarBitacora(id: number, comentario: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets/${id}/bitacora`, { comentario });
  }

  listarEspecialistas(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/soporte`);
  }
}