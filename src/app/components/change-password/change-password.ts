import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.html'
})
export class ChangePasswordComponent {
  authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  guardando = signal(false);
  errorMensaje = signal('');

  get cumpleLongitud(): boolean {
    return this.nuevaPassword.length >= 6 && this.nuevaPassword.length <= 12;
  }

  get cumpleMayuscula(): boolean {
    return /[A-Z]/.test(this.nuevaPassword);
  }

  get cumpleMinuscula(): boolean {
    return /[a-z]/.test(this.nuevaPassword);
  }

  get cumpleNumero(): boolean {
    return /\d/.test(this.nuevaPassword);
  }

  get coincideConfirmacion(): boolean {
    return this.nuevaPassword.length > 0 && this.nuevaPassword === this.confirmarPassword;
  }

  get formularioValido(): boolean {
    return !!this.passwordActual.trim()
      && this.cumpleLongitud
      && this.cumpleMayuscula
      && this.cumpleMinuscula
      && this.cumpleNumero
      && this.coincideConfirmacion;
  }

  actualizar(): void {
    this.errorMensaje.set('');
    if (!this.formularioValido) {
      this.errorMensaje.set('Verifique que la nueva contraseña cumpla todos los requisitos de seguridad.');
      return;
    }

    this.guardando.set(true);
    this.usuarioService.cambiarPassword(this.passwordActual, this.nuevaPassword).subscribe({
      next: (usuarioActualizado) => {
        this.guardando.set(false);
        this.authService.actualizarUsuarioLocal(usuarioActualizado);
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorMensaje.set(err?.error?.mensaje || 'No se pudo actualizar la contraseña.');
      }
    });
  }
}