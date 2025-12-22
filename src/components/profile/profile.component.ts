
import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      <h2 class="text-2xl font-bold mb-2 text-slate-800">Mi Perfil</h2>
      <p class="text-slate-500 mb-6">Actualiza tus datos personales</p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nombre de Usuario</label>
          <input [(ngModel)]="username" type="text" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input [(ngModel)]="email" type="email" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" [disabled]="role() === 'guest'" [title]="role() === 'guest' ? 'Los invitados no tienen email' : ''">
        </div>

        @if (role() !== 'guest') {
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña (opcional)</label>
            <input [(ngModel)]="password" type="password" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="Dejar en blanco para no cambiar">
          </div>
        }

        <div class="pt-4">
          <button (click)="save()" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
            Guardar Cambios
          </button>
        </div>

        @if (message()) {
          <div class="bg-green-50 text-green-600 p-3 rounded-lg text-center mt-2 border border-green-100 animate-fade-in">
            {{ message() }}
          </div>
        }
      </div>

      @if (role() === 'guest') {
        <div class="mt-6 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
          Nota: Estás conectado como invitado. Tus cambios solo se guardan en esta sesión.
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  
  username = '';
  email = '';
  password = '';
  role = signal('');
  message = signal('');

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.username = user.username;
      this.email = user.email || '';
      this.role.set(user.role);
    }
  }

  save() {
    if (!this.username) {
      alert('El nombre de usuario es obligatorio');
      return;
    }

    const updates: any = { username: this.username, email: this.email };
    if (this.password) {
      updates.password = this.password;
    }

    this.authService.updateProfile(updates);
    this.message.set('¡Perfil actualizado correctamente!');
    
    setTimeout(() => this.message.set(''), 3000);
  }
}
