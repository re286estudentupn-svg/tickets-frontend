import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../auth.service';
import { AREAS_EMPRESA, RolUsuario, Usuario } from '../../models/servicedesk.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-list.html'
})
export class UserListComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  authService = inject(AuthService);

  readonly areas = AREAS_EMPRESA;
  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  mensajeExito = signal('');
  mensajeError = signal('');

  nombre = '';
  email = '';
  password = '';
  rol: RolUsuario = 'USUARIO_FINAL';
  area = '';
  debeCambiarPassword = true;

  editandoId = signal<number | null>(null);
  editNombre = '';
  editRol: RolUsuario = 'USUARIO_FINAL';
  editArea = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuarioService.listarTodos().subscribe({
      next: (lista) => {
        this.usuarios.set(lista);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo cargar el directorio de usuarios.');
      }
    });
  }

  crearCuenta(): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');

    if (!this.nombre.trim() || !this.email.trim() || !this.password.trim() || !this.area) {
      this.mensajeError.set('Complete todos los campos obligatorios para crear la cuenta.');
      return;
    }

    if (this.debeCambiarPassword) {
      if (this.password.length < 5 || this.password.length > 12) {
        this.mensajeError.set('La contraseña temporal debe tener entre 5 y 12 caracteres.');
        return;
      }
    } else {
      const patronSeguro = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/;
      if (!patronSeguro.test(this.password)) {
        this.mensajeError.set('La contraseña definitiva debe tener entre 6 y 12 caracteres, con al menos 1 mayúscula, 1 minúscula y 1 número (símbolos opcionales).');
        return;
      }
    }

    this.guardando.set(true);
    this.usuarioService.crearPorAdmin({
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: this.rol,
      area: this.area,
      debeCambiarPassword: this.debeCambiarPassword
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensajeExito.set('Usuario creado exitosamente.');
        this.nombre = '';
        this.email = '';
        this.password = '';
        this.area = '';
        this.rol = 'USUARIO_FINAL';
        this.debeCambiarPassword = true;
        this.cargarUsuarios();
      },
      error: (err) => {
        this.guardando.set(false);
        const errores = err?.error?.errores ? Object.values(err.error.errores).join(' · ') : '';
        this.mensajeError.set(errores || err?.error?.mensaje || 'No se pudo crear la cuenta.');
      }
    });
  }

  iniciarEdicion(u: Usuario): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.editandoId.set(u.id);
    this.editNombre = u.nombre;
    this.editRol = u.rol;
    this.editArea = u.area;
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  guardarEdicion(id: number): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.usuarioService.actualizarUsuario(id, {
      nombre: this.editNombre,
      rol: this.editRol,
      area: this.editArea
    }).subscribe({
      next: () => {
        this.editandoId.set(null);
        this.mensajeExito.set('Datos del usuario actualizados correctamente.');
        this.cargarUsuarios();
      },
      error: (err) => {
        this.mensajeError.set(err?.error?.mensaje || 'No se pudieron guardar los cambios.');
      }
    });
  }

  cambiarEstado(u: Usuario): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.usuarioService.alternarEstado(u.id).subscribe({
      next: (actualizado) => {
        this.mensajeExito.set(`Usuario ${actualizado.activo ? 'activado' : 'desactivado'} correctamente.`);
        this.cargarUsuarios();
      },
      error: (err) => {
        this.mensajeError.set(err?.error?.mensaje || 'No se pudo actualizar el estado del usuario.');
      }
    });
  }

  claseRol(rol: RolUsuario): string {
    if (rol === 'JEFE_TI') return 'bg-danger';
    if (rol === 'SOPORTE_TI') return 'bg-primary';
    return 'bg-secondary';
  }
}