
import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-6">Tu Carrito de Compras</h1>

      @if (cartService.items().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items List -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cartService.items(); track item.id) {
              <div class="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 border border-slate-100">
                <img [src]="item.image" class="w-20 h-20 rounded-lg object-cover bg-slate-200">
                
                <div class="flex-grow">
                  <h3 class="font-bold text-slate-800">{{ item.name }}</h3>
                  <p class="text-slate-500 text-sm">{{ item.price }} € / unidad</p>
                </div>
                
                <div class="flex items-center space-x-3">
                  <button (click)="updateQty(item.id, item.quantity - 1)" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition">-</button>
                  <span class="font-medium w-6 text-center">{{ item.quantity }}</span>
                  <button (click)="updateQty(item.id, item.quantity + 1)" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition">+</button>
                </div>
                
                <div class="text-right min-w-[80px]">
                  <div class="font-bold text-slate-800">{{ (item.price * item.quantity).toFixed(2) }} €</div>
                  <button (click)="remove(item.id)" class="text-red-400 hover:text-red-600 text-xs mt-1 underline">Eliminar</button>
                </div>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-24">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Resumen</h3>
              
              <div class="flex justify-between mb-2 text-slate-600">
                <span>Subtotal</span>
                <span>{{ cartService.total().toFixed(2) }} €</span>
              </div>
              <div class="flex justify-between mb-4 text-slate-600">
                <span>Envío</span>
                <span class="text-green-600 font-medium">Gratis</span>
              </div>
              
              <div class="border-t border-slate-200 pt-4 flex justify-between mb-6">
                <span class="font-bold text-xl text-slate-800">Total</span>
                <span class="font-bold text-xl text-indigo-600">{{ cartService.total().toFixed(2) }} €</span>
              </div>
              
              <button 
                routerLink="/checkout" 
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:-translate-y-0.5">
                Proceder al Pago
              </button>
              
              <button 
                (click)="clear()" 
                class="w-full mt-3 text-slate-400 hover:text-red-500 text-sm transition">
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="text-xl text-slate-500 mb-6">Tu carrito está vacío.</p>
          <a routerLink="/shop" class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Volver a la Tienda
          </a>
        </div>
      }
    </div>
  `
})
export class CartComponent {
  cartService = inject(CartService);

  updateQty(id: string, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  remove(id: string) {
    this.cartService.removeFromCart(id);
  }

  clear() {
    this.cartService.clearCart();
  }
}
