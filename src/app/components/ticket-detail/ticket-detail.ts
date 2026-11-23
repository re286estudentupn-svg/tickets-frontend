import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../auth.service';
import { EstadoTicket, PrioridadTicket, Ticket, Usuario } from '../../models/servicedesk.models';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ticketService = inject(TicketService);
  authService = inject(AuthService);

  ticket = signal<Ticket | null>(null);
  especialistas = signal<Usuario[]>([]);
  cargando = signal(true);
  procesando = signal(false);
  mensajeExito = signal('');
  mensajeError = signal('');

  nuevoEstado: EstadoTicket = 'EN_PROGRESO';
  comentarioEstado = '';

  nuevaPrioridad: PrioridadTicket = 'MEDIA';
  comentarioPrioridad = '';

  tecnicoSeleccionadoId: number | null = null;
  comentarioAsignacion = '';

  nuevaNotaBitacora = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarDetalle(id);
    }
    if (this.authService.esJefe()) {
      this.ticketService.listarEspecialistas().subscribe({
        next: (lista) => this.especialistas.set(lista),
        error: () => {}
      });
    }
  }

  cargarDetalle(id: number): void {
    this.cargando.set(true);
    this.ticketService.obtenerDetalle(id).subscribe({
      next: (data) => {
        this.ticket.set(data);
        this.nuevoEstado = data.estado === 'PENDIENTE' ? 'EN_PROGRESO' : data.estado;
        this.nuevaPrioridad = data.prioridad === 'SIN_ASIGNAR' ? 'MEDIA' : data.prioridad;
        this.tecnicoSeleccionadoId = data.tecnicoAsignado?.id ?? null;
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo cargar el detalle del ticket.');
      }
    });
  }

  tomarEsteTicket(): void {
    const t = this.ticket();
    if (!t) return;

    this.limpiarAlertas();
    this.procesando.set(true);
    this.ticketService.tomarTicket(t.id).subscribe({
      next: (actualizado) => {
        this.ticket.set(actualizado);
        this.tecnicoSeleccionadoId = actualizado.tecnicoAsignado?.id ?? null;
        this.procesando.set(false);
        this.mensajeExito.set('Ticket asignado a tu cola de atención.');
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo tomar el ticket.');
      }
    });
  }

  guardarPrioridad(): void {
    const t = this.ticket();
    if (!t) return;

    this.limpiarAlertas();
    this.procesando.set(true);
    this.ticketService.actualizarPrioridad(t.id, this.nuevaPrioridad, this.comentarioPrioridad).subscribe({
      next: (actualizado) => {
        this.ticket.set(actualizado);
        this.comentarioPrioridad = '';
        this.procesando.set(false);
        this.mensajeExito.set('Prioridad actualizada correctamente.');
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo actualizar la prioridad.');
      }
    });
  }

  guardarEstado(): void {
    const t = this.ticket();
    if (!t || !this.comentarioEstado.trim()) {
      this.mensajeError.set('Ingrese un comentario técnico para respaldar el cambio de estado.');
      return;
    }

    this.limpiarAlertas();
    this.procesando.set(true);
    this.ticketService.actualizarEstado(t.id, this.nuevoEstado, this.comentarioEstado).subscribe({
      next: (actualizado) => {
        this.ticket.set(actualizado);
        this.comentarioEstado = '';
        this.procesando.set(false);
        this.mensajeExito.set('Estado actualizado correctamente.');
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo actualizar el estado.');
      }
    });
  }

  asignarTecnico(): void {
    const t = this.ticket();
    if (!t || !this.tecnicoSeleccionadoId) {
      this.mensajeError.set('Seleccione un especialista de soporte.');
      return;
    }

    this.limpiarAlertas();
    this.procesando.set(true);
    this.ticketService.asignarEspecialista(t.id, Number(this.tecnicoSeleccionadoId), this.comentarioAsignacion).subscribe({
      next: (actualizado) => {
        this.ticket.set(actualizado);
        this.comentarioAsignacion = '';
        this.procesando.set(false);
        this.mensajeExito.set('Especialista asignado correctamente.');
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo asignar el especialista.');
      }
    });
  }

  registrarNota(): void {
    const t = this.ticket();
    if (!t || !this.nuevaNotaBitacora.trim()) {
      this.mensajeError.set('Escriba un comentario antes de guardar.');
      return;
    }

    this.limpiarAlertas();
    this.procesando.set(true);
    this.ticketService.agregarBitacora(t.id, this.nuevaNotaBitacora).subscribe({
      next: (actualizado) => {
        this.ticket.set(actualizado);
        this.nuevaNotaBitacora = '';
        this.procesando.set(false);
        this.mensajeExito.set('Comentario registrado en la bitácora.');
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo guardar el comentario.');
      }
    });
  }

  private limpiarAlertas(): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }
}