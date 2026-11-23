import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../auth.service';
import { CATEGORIAS_SERVICIO, DashboardMetrics, Ticket } from '../../models/servicedesk.models';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketListComponent implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  authService = inject(AuthService);

  readonly categorias = CATEGORIAS_SERVICIO;
  metricas = signal<DashboardMetrics | null>(null);
  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  errorMensaje = signal('');
  exitoMensaje = signal('');
  vistaActual = signal<'global' | 'asignados' | 'sin-asignar'>('global');

  filtroBuscar = '';
  filtroCategoria = '';
  filtroPrioridad = '';
  filtroEstado = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const vista = params.get('vista');
      if (vista === 'asignados') {
        this.vistaActual.set('asignados');
      } else if (vista === 'sin-asignar') {
        this.vistaActual.set('sin-asignar');
      } else {
        this.vistaActual.set('global');
      }
      this.exitoMensaje.set('');
      this.cargarTodo();
    });
  }

  tituloPagina(): string {
    if (!this.authService.esSoporteOJefe()) return 'Mi Portal de Soporte TI';
    if (this.vistaActual() === 'asignados') return 'Mis Tickets Asignados';
    if (this.vistaActual() === 'sin-asignar') {
      return this.authService.esJefe() ? 'Tickets Pendientes de Asignación' : 'Tickets Libres para Atender';
    }
    return this.authService.esJefe() ? 'Centro de Supervisión TI' : 'Mesa de Atención Técnica';
  }

  subtituloPagina(): string {
    if (!this.authService.esSoporteOJefe()) return 'Consulta en tiempo real el avance y resolución de tus incidencias reportadas';
    if (this.vistaActual() === 'asignados') return 'Incidencias bajo tu responsabilidad técnica directa';
    if (this.vistaActual() === 'sin-asignar') return 'Incidencias disponibles que cualquier especialista libre puede tomar para su atención';
    return 'Supervisión, trazabilidad y control de incidencias corporativas de TI';
  }

  cargarTodo(): void {
    this.cargando.set(true);
    this.errorMensaje.set('');

    this.ticketService.obtenerDashboard().subscribe({
      next: (data) => this.metricas.set(data),
      error: () => {}
    });

    this.buscarTickets();
  }

  buscarTickets(): void {
    this.cargando.set(true);
    this.ticketService.listarTickets({
      buscar: this.filtroBuscar,
      categoria: this.filtroCategoria,
      prioridad: this.filtroPrioridad,
      estado: this.filtroEstado,
      soloAsignados: this.vistaActual() === 'asignados',
      soloSinAsignar: this.vistaActual() === 'sin-asignar'
    }).subscribe({
      next: (lista) => {
        this.tickets.set(lista);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err?.error?.mensaje || 'No se pudo cargar la cola de tickets.');
      }
    });
  }

  tomarRapido(t: Ticket): void {
    this.errorMensaje.set('');
    this.exitoMensaje.set('');
    this.ticketService.tomarTicket(t.id).subscribe({
      next: () => {
        this.exitoMensaje.set(`Ticket ${t.codigo} tomado exitosamente.`);
        this.cargarTodo();
      },
      error: (err) => {
        this.errorMensaje.set(err?.error?.mensaje || 'No se pudo tomar el ticket.');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroBuscar = '';
    this.filtroCategoria = '';
    this.filtroPrioridad = '';
    this.filtroEstado = '';
    this.buscarTickets();
  }

  clasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'CRITICA': return 'bg-danger';
      case 'ALTA': return 'bg-warning text-dark';
      case 'MEDIA': return 'bg-info text-dark';
      case 'BAJA': return 'bg-secondary';
      default: return 'bg-light text-dark border';
    }
  }

  claseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-secondary';
      case 'ASIGNADO': return 'bg-primary';
      case 'EN_PROGRESO': return 'bg-warning text-dark';
      case 'RESUELTO': return 'bg-success';
      default: return 'bg-light text-dark';
    }
  }
}