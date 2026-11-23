import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { AREAS_EMPRESA } from '../../models/servicedesk.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  readonly areas = AREAS_EMPRESA;
  modoRegistro = signal(false);

  email = '';
  password = '';

  regNombre = '';
  regEmail = '';
  regPassword = '';
  regArea = '';

  cargando = signal(false);
  errorMensaje = signal('');
  exitoMensaje = signal('');

  alternarModo(registro: boolean): void {
    this.modoRegistro.set(registro);
    this.errorMensaje.set('');
    this.exitoMensaje.set('');
  }

  completarDemo(correo: string, clave: string): void {
    this.email = correo;
    this.password = clave;
    this.errorMensaje.set('');
  }

  iniciarSesion(): void {
    this.errorMensaje.set('');
    this.exitoMensaje.set('');
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMensaje.set('Ingrese su correo corporativo y contraseña.');
      return;
    }

    this.cargando.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.cargando.set(false);
        if (res.usuario.debeCambiarPassword) {
          this.router.navigate(['/cambiar-password']);
        } else {
          this.router.navigate(['/tickets']);
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err?.error?.mensaje || 'Credenciales incorrectas o cuenta inactiva.');
      }
    });
  }

  registrarCuenta(): void {
    this.errorMensaje.set('');
    this.exitoMensaje.set('');
    if (!this.regNombre.trim() || !this.regEmail.trim() || !this.regPassword.trim() || !this.regArea) {
      this.errorMensaje.set('Complete todos los campos para registrar su cuenta.');
      return;
    }
    const patronSeguro = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/;
    if (!patronSeguro.test(this.regPassword)) {
      this.errorMensaje.set('La contraseña debe tener entre 6 y 12 caracteres, incluir 1 mayúscula, 1 minúscula y 1 número (símbolos opcionales).');
      return;
    }

    this.cargando.set(true);
    this.usuarioService.registrarColaborador({
      nombre: this.regNombre,
      email: this.regEmail,
      password: this.regPassword,
      area: this.regArea
    }).subscribe({
      next: (u) => {
        this.cargando.set(false);
        this.email = u.email;
        this.password = '';
        this.regNombre = '';
        this.regEmail = '';
        this.regPassword = '';
        this.regArea = '';
        this.modoRegistro.set(false);
        this.exitoMensaje.set(`Cuenta creada para ${u.nombre}. Ahora inicie sesión con su contraseña.`);
      },
      error: (err) => {
        this.cargando.set(false);
        const errores = err?.error?.errores ? Object.values(err.error.errores).join(' · ') : '';
        this.errorMensaje.set(errores || err?.error?.mensaje || 'No se pudo completar el registro.');
      }
    });
  }
}