
import { Injectable, signal, effect } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = signal<Product[]>([]);

  constructor() {
    const saved = localStorage.getItem('products');
    if (saved) {
      this.products.set(JSON.parse(saved));
    } else {
      // Seed data with high quality Unsplash images matching the items
      this.products.set([
        {
          id: '1',
          name: 'Zapatillas Running Pro',
          description: 'Zapatillas de alta velocidad para corredores exigentes. Suela ergonómica y transpirable.',
          price: 89.95,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
          category: 'Calzado'
        },
        {
          id: '2',
          name: 'Reloj Inteligente AI',
          description: 'Monitorea tu salud con inteligencia artificial avanzada. Batería de larga duración.',
          price: 149.00,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
          category: 'Tecnología'
        },
        {
          id: '3',
          name: 'Mochila Urbana Impermeable',
          description: 'Diseño minimalista y resistente al agua para la ciudad. Compartimento para laptop.',
          price: 45.00,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
          category: 'Accesorios'
        },
        {
          id: '4',
          name: 'Auriculares Noise Cancelling',
          description: 'Sonido inmersivo con cancelación de ruido activa para tu concentración absoluta.',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
          category: 'Tecnología'
        },
        {
          id: '5',
          name: 'Sudadera Minimalista',
          description: 'Algodón orgánico de alta calidad, diseño unisex y muy cómoda para el día a día.',
          price: 39.95,
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80',
          category: 'Ropa'
        },
        {
          id: '6',
          name: 'Lámpara LED de Escritorio',
          description: 'Diseño moderno con brazo articulado. Luz cálida y fría regulable.',
          price: 29.50,
          image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14db39?auto=format&fit=crop&w=500&q=80',
          category: 'Hogar'
        },
        {
          id: '7',
          name: 'Cámara Mirrorless 4K',
          description: 'Graba tus aventuras con la máxima resolución y estabilización profesional.',
          price: 520.00,
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
          category: 'Tecnología'
        },
        {
          id: '8',
          name: 'Botella Térmica Premium',
          description: 'Mantiene tus bebidas frías por 24h y calientes por 12h. Acero inoxidable.',
          price: 19.90,
          image: 'https://images.unsplash.com/photo-1602143407151-011141950038?auto=format&fit=crop&w=500&q=80',
          category: 'Accesorios'
        }
      ]);
    }

    // Auto-save effect
    effect(() => {
      localStorage.setItem('products', JSON.stringify(this.products()));
    });
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct = { ...product, id: Date.now().toString() };
    this.products.update(p => [...p, newProduct]);
  }

  updateProduct(updatedProduct: Product) {
    this.products.update(p => p.map(item => item.id === updatedProduct.id ? updatedProduct : item));
  }

  deleteProduct(id: string) {
    this.products.update(p => p.filter(item => item.id !== id));
  }
}
