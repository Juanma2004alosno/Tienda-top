
import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from './product.service';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);

  total = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  count = computed(() => {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  });

  constructor() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items.set(JSON.parse(saved));
    }
    
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }

  addToCart(product: Product) {
    this.items.update(current => {
      const exists = current.find(i => i.id === product.id);
      if (exists) {
        return current.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string) {
    this.items.update(current => current.filter(i => i.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.items.update(current => current.map(i => i.id === productId ? { ...i, quantity } : i));
  }

  clearCart() {
    this.items.set([]);
  }
}
