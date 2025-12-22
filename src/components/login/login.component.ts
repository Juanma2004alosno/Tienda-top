
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      <h2 class="text-2xl font-bold text-center mb-6 text-slate-800">Acceso a Tienda</h2>
      
      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 mb-6">
        <button 
          (click)="view.set('login'); errorMsg.set('')" 
          [class]="view() === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'" 
          class="flex-1 py-2 border-b-2 font-medium transition focus:outline-none">
          Entrar
        </button>
        <button 
          (click)="view.set('register'); errorMsg.set('')" 
          [class]="view() === 'register' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'" 
          class="flex-1 py-2 border-b-2 font-medium transition focus:outline-none">
          Registrarse
        </button>
        <button 
          (click)="view.set('admin'); errorMsg.set('')" 
          [class]="view() === 'admin' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'" 
          class="flex-1 py-2 border-b-2 font-medium transition focus:outline-none">
          Soy el Dueño
        </button>
      </div>

      <div class="space-y-4">
        
        <!-- Error Message -->
        @if (errorMsg()) {
          <div class="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center animate-pulse border border-red-100">
            {{ errorMsg() }}
          </div>
        }

        <!-- Customer Login View -->
        @if (view() === 'login') {
          <div class="animate-fade-in">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
              <input type="text" [(ngModel)]="username" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="Tu nombre de usuario">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input type="password" [(ngModel)]="password" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="••••••••">
            </div>
            <button (click)="doLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-md">
              Iniciar Sesión
            </button>
            
            <div class="relative flex py-4 items-center">
              <div class="flex-grow border-t border-slate-200"></div>
              <span class="flex-shrink-0 mx-4 text-slate-400 text-sm">o</span>
              <div class="flex-grow border-t border-slate-200"></div>
            </div>

            <button (click)="guestLogin()" class="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition flex items-center justify-center">
              Continuar como Invitado
            </button>
          </div>
        }

        <!-- Registration View -->
        @if (view() === 'register') {
          <div class="animate-fade-in">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
              <input type="text" [(ngModel)]="username" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" [(ngModel)]="email" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input type="password" [(ngModel)]="password" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
            </div>
            <button (click)="doRegister()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-md">
              Crear Cuenta
            </button>
          </div>
        }

        <!-- Admin View -->
        @if (view() === 'admin') {
          <div class="animate-fade-in bg-slate-50 p-6 rounded-lg border border-slate-200">
            <p class="text-sm text-slate-600 mb-4 text-center">Introduce el código secreto para acceder al panel de gestión.</p>
            <div class="mb-4">
              <label class="block text-sm font-bold text-slate-700 mb-1">Código Secreto</label>
              <input type="password" [(ngModel)]="secretCode" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none tracking-widest bg-white text-slate-900" placeholder="••••">
            </div>
            <button (click)="doAdminLogin()" class="w-full mt-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition shadow-md">
              Entrar como Dueño
            </button>
            <p class="text-xs text-center text-slate-400 mt-4">
              (Código Demo: <strong>SECRET123</strong>)
            </p>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  view = signal<'login' | 'register' | 'admin'>('login');
  
  // Form fields
  username = signal('');
  password = signal('');
  email = signal('');
  secretCode = signal('');
  
  errorMsg = signal('');

  doLogin() {
    if (!this.username() || !this.password()) {
      this.errorMsg.set('Por favor completa todos los campos.');
      return;
    }

    const success = this.authService.login(this.username(), this.password());
    if (success) {
      this.router.navigate(['/shop']);
    } else {
      this.errorMsg.set('Usuario o contraseña incorrectos.');
    }
  }

  doRegister() {
    if (!this.username() || !this.password() || !this.email()) {
      this.errorMsg.set('Todos los campos son obligatorios.');
      return;
    }

    const success = this.authService.register(this.username(), this.email(), this.password());
    if (success) {
      this.router.navigate(['/shop']);
    } else {
      this.errorMsg.set('El usuario ya existe.');
    }
  }

  doAdminLogin() {
    if (!this.secretCode()) {
      this.errorMsg.set('Introduce el código secreto.');
      return;
    }

    const success = this.authService.login('admin', undefined, this.secretCode());
    if (success) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMsg.set('Código secreto incorrecto.');
    }
  }

  guestLogin() {
    this.authService.loginAsGuest();
    this.router.navigate(['/shop']);
  }
}
