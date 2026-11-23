import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../auth.service';
import {
  CATEGORIAS_SERVICIO,
  CategoriaTicket,
  NuevoTicketRequest,
  PrioridadTicket
} from '../../models/servicedesk.models';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketFormComponent {
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);
  authService = inject(AuthService);

  readonly categorias = CATEGORIAS_SERVICIO;

  titulo = '';
  categoria: CategoriaTicket | '' = '';
  prioridad: PrioridadTicket = 'SIN_ASIGNAR';
  ubicacion = '';
  descripcion = '';

  guardando = signal(false);
  errorMensaje = signal('');
  erroresCampos = signal<Record<string, string>>({});
  listaErrores = computed(() => Object.values(this.erroresCampos()));

  registrar(): void {
    this.errorMensaje.set('');
    this.erroresCampos.set({});

    if (!this.titulo.trim() || !this.categoria || !this.ubicacion.trim() || !this.descripcion.trim()) {
      this.errorMensaje.set('Complete todos los campos obligatorios antes de registrar el ticket.');
      return;
    }

    const payload: NuevoTicketRequest = {
      titulo: this.titulo,
      categoria: this.categoria,
      ubicacion: this.ubicacion,
      descripcion: this.descripcion
    };

    if (this.authService.esSoporteOJefe()) {
      payload.prioridad = this.prioridad;
    }

    this.guardando.set(true);
    this.ticketService.crearTicket(payload).subscribe({
      next: (creado) => {
        this.guardando.set(false);
        this.router.navigate(['/tickets', creado.id]);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorMensaje.set(err?.error?.mensaje || 'No se pudo registrar la incidencia.');
        if (err?.error?.errores) {
          this.erroresCampos.set(err.error.errores);
        }
      }
    });
  }
}