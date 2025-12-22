
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      
      <!-- Left Column: Forms -->
      <div class="lg:col-span-2">
        @if (!successMessage()) {
          <h2 class="text-2xl font-bold mb-6 text-slate-800 flex items-center">
            <span class="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
            Datos de Envío y Contacto
          </h2>

          @if (!authService.currentUser()) {
            <div class="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100 flex items-center justify-between">
              <div>
                <p class="text-indigo-900 font-medium text-sm">¿Ya tienes cuenta?</p>
                <p class="text-xs text-indigo-700">Inicia sesión para autocompletar tus datos.</p>
              </div>
              <button (click)="router.navigate(['/login'])" class="text-xs bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition font-bold">
                Ir al Login
              </button>
            </div>
          }

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
            
            <!-- Personal Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre</label>
                <input type="text" [(ngModel)]="firstName" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition" placeholder="Ej. Juan">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Apellidos</label>
                <input type="text" [(ngModel)]="lastName" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition" placeholder="Ej. Pérez">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Email (para factura)</label>
                <input type="email" [(ngModel)]="email" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition" placeholder="nombre@ejemplo.com">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono Móvil</label>
                <input type="tel" [(ngModel)]="phone" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition" placeholder="+34 600 000 000">
              </div>
            </div>

            <!-- Address Info -->
            <div class="pt-4 border-t border-slate-100">
               <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección (Calle y número)</label>
               <input type="text" [(ngModel)]="street" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition mb-4" placeholder="Av. Principal 123">
               
               <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Piso / Puerta / Apartamento (Opcional)</label>
               <input type="text" [(ngModel)]="apartment" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition mb-4" placeholder="1º B">

               <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div class="col-span-2 md:col-span-1">
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ciudad</label>
                    <input type="text" [(ngModel)]="city" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Provincia/Estado</label>
                    <input type="text" [(ngModel)]="state" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Código Postal</label>
                    <input type="text" [(ngModel)]="zip" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition">
                  </div>
               </div>
               
               <div class="mt-4">
                 <label class="block text-xs font-bold text-slate-700 uppercase mb-1">País</label>
                 <select [(ngModel)]="country" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 transition">
                   <option value="España">España</option>
                   <option value="México">México</option>
                   <option value="Colombia">Colombia</option>
                   <option value="Argentina">Argentina</option>
                   <option value="Estados Unidos">Estados Unidos</option>
                   <option value="Otro">Otro</option>
                 </select>
               </div>
            </div>
          </div>

          <h2 class="text-2xl font-bold mb-6 text-slate-800 flex items-center">
            <span class="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
            Método de Pago
          </h2>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div class="flex space-x-4 mb-4">
              <div class="flex items-center space-x-2 border border-indigo-500 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                <span class="font-bold text-sm">Tarjeta Crédito/Débito</span>
              </div>
              <div class="flex items-center space-x-2 border border-slate-200 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed opacity-50">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span class="font-bold text-sm">PayPal</span>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Tarjeta</label>
                <div class="relative">
                  <input type="text" class="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 tracking-widest" placeholder="0000 0000 0000 0000">
                  <svg class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Vencimiento</label>
                  <input type="text" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="MM/YY">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">CVC</label>
                  <input type="text" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="123">
                </div>
              </div>
              <div>
                 <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Titular de la Tarjeta</label>
                 <input type="text" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="Como aparece en la tarjeta">
              </div>
            </div>
          </div>

        } @else {
          <!-- Success View (Full Width in success mode) -->
          <div class="text-center animate-fade-in bg-white p-8 rounded-xl shadow-lg border border-slate-100 col-span-2 lg:col-span-3">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 class="text-3xl font-bold text-slate-800 mb-2">¡Gracias por tu compra, {{ firstName }}!</h2>
            <p class="text-slate-500 mb-8 text-lg">Tu pedido ha sido procesado correctamente.</p>
            
            <div class="bg-slate-800 text-left p-8 rounded-lg shadow-2xl mb-8 relative overflow-hidden max-w-2xl mx-auto">
              <div class="absolute top-0 right-0 bg-green-600 px-4 py-1 text-xs font-bold text-white rounded-bl-lg">EMAIL ENVIADO</div>
              <pre class="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{{ successMessage() }}</pre>
            </div>

            <button (click)="finish()" class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1">Volver a la Tienda</button>
          </div>
        }
      </div>

      <!-- Right Column: Order Summary (Sticky) -->
      @if (!successMessage()) {
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-24">
            <h3 class="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Resumen del Pedido</h3>
            
            <div class="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
               @for (item of cartService.items(); track item.id) {
                 <div class="flex justify-between text-sm">
                   <span class="text-slate-600"><span class="font-bold">{{ item.quantity }}x</span> {{ item.name }}</span>
                   <span class="text-slate-800 font-medium">{{ (item.price * item.quantity).toFixed(2) }} €</span>
                 </div>
               }
            </div>
            
            <div class="flex justify-between mb-2 text-slate-600 text-sm">
              <span>Subtotal</span>
              <span>{{ cartService.total().toFixed(2) }} €</span>
            </div>
            <div class="flex justify-between mb-4 text-slate-600 text-sm">
              <span>Envío</span>
              <span class="text-green-600 font-bold">Gratis</span>
            </div>
            
            <div class="border-t border-slate-200 pt-4 flex justify-between mb-6">
              <span class="font-extrabold text-xl text-slate-900">Total</span>
              <span class="font-extrabold text-xl text-indigo-600">{{ cartService.total().toFixed(2) }} €</span>
            </div>

            <button 
              (click)="processPayment()" 
              [disabled]="processing()"
              class="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-lg shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              @if (processing()) {
                 <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>Procesando...</span>
              } @else {
                 <span>Pagar Ahora</span>
              }
            </button>
            <p class="text-[10px] text-slate-400 text-center mt-4">
              Transacción segura con encriptación SSL simulada.
            </p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    /* Custom Scrollbar for the summary list */
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  geminiService = inject(GeminiService);
  router = inject(Router);

  // Form Fields
  email = '';
  firstName = '';
  lastName = '';
  phone = '';
  street = '';
  apartment = '';
  city = '';
  state = '';
  zip = '';
  country = 'España';

  processing = signal(false);
  successMessage = signal('');

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      this.email = user.email || '';
      // Pre-fill name if username looks like a name (simple heuristic)
      if (user.username && !user.username.includes('user')) {
        this.firstName = user.username;
      }
    }
  }

  async processPayment() {
    // Basic validation
    if (!this.firstName || !this.lastName || !this.email || !this.phone || !this.street || !this.city || !this.zip) {
      alert('Por favor completa todos los campos obligatorios de envío y contacto.');
      return;
    }

    this.processing.set(true);
    
    // Simulate Payment Gateway API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Construct detailed shipping info for the AI Invoice
    const shippingDetails = `
      Nombre: ${this.firstName} ${this.lastName}
      Email: ${this.email}
      Teléfono: ${this.phone}
      Dirección: ${this.street}, ${this.apartment ? this.apartment + ', ' : ''}
      ${this.city}, ${this.state} ${this.zip}
      País: ${this.country}
    `;

    // Generate Invoice with AI
    const invoiceText = await this.geminiService.generateInvoiceEmail(
      `${this.firstName} ${this.lastName}`,
      shippingDetails,
      this.cartService.items(),
      this.cartService.total()
    );

    this.successMessage.set(invoiceText);
    this.cartService.clearCart();
    this.processing.set(false);
    
    // Scroll to top to see success message clearly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  finish() {
    this.router.navigate(['/shop']);
  }
}
