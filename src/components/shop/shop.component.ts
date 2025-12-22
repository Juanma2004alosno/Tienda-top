
import { Component, inject, computed, signal } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto">
      
      <!-- Top Bar: Search and Sort -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-30">
        
        <!-- Search Bar -->
        <div class="relative w-full md:max-w-xl">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            placeholder="Buscar productos (ej. Zapatillas, Reloj)..." 
            class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition shadow-inner"
          >
        </div>

        <!-- Sort Dropdown -->
        <div class="flex items-center space-x-2 w-full md:w-auto">
          <span class="text-sm text-slate-500 whitespace-nowrap">Ordenar por:</span>
          <select 
            [(ngModel)]="sortOption"
            class="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-slate-900 border shadow-sm">
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Bajo a Alto</option>
            <option value="price-desc">Precio: Alto a Bajo</option>
            <option value="name-asc">Nombre: A-Z</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-40">
            <h3 class="font-bold text-slate-900 mb-4 text-lg">Departamentos</h3>
            <ul class="space-y-2">
              <li>
                <button 
                  (click)="selectedCategory.set(null)"
                  [class]="!selectedCategory() ? 'font-bold text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'"
                  class="w-full text-left px-3 py-2 rounded-md transition text-sm flex justify-between items-center">
                  Todos los productos
                  @if (!selectedCategory()) { <span>&bull;</span> }
                </button>
              </li>
              @for (cat of categories(); track cat) {
                <li>
                  <button 
                    (click)="selectedCategory.set(cat)"
                    [class]="selectedCategory() === cat ? 'font-bold text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'"
                    class="w-full text-left px-3 py-2 rounded-md transition text-sm flex justify-between items-center">
                    {{ cat }}
                    @if (selectedCategory() === cat) { <span>&bull;</span> }
                  </button>
                </li>
              }
            </ul>

            <div class="mt-8 pt-6 border-t border-slate-100">
              <h3 class="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Estado</h3>
              <p class="text-xs text-slate-500 mb-2">Mostrando {{ filteredProducts().length }} resultados</p>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-grow">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of filteredProducts(); track product.id) {
              <div class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col h-full overflow-hidden">
                <!-- Image Container -->
                <div class="relative h-64 overflow-hidden bg-slate-100">
                   <img 
                     [src]="product.image" 
                     [alt]="product.name" 
                     class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                   >
                   @if (authService.currentUser()?.role === 'admin') {
                     <div class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                       ADMIN EDIT
                     </div>
                   }
                </div>
                
                <div class="p-5 flex flex-col flex-grow">
                  <div class="mb-2">
                    <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full">{{ product.category }}</span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{{ product.name }}</h3>
                  
                  <p class="text-slate-500 text-xs mb-4 line-clamp-3 leading-relaxed flex-grow">{{ product.description }}</p>
                  
                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span class="text-xl font-extrabold text-slate-900">{{ product.price }} <span class="text-sm font-normal text-slate-500">€</span></span>
                    
                    <button 
                      (click)="addToCart(product)"
                      class="bg-slate-900 hover:bg-indigo-600 text-white rounded-full p-2 shadow-lg transition-transform transform active:scale-95 group-active:bg-indigo-700"
                      title="Añadir al carrito">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-slate-900">No se encontraron productos</h3>
                <p class="mt-1 text-sm text-slate-500">Intenta con otra búsqueda o cambia los filtros.</p>
                <button (click)="resetFilters()" class="mt-6 text-indigo-600 hover:text-indigo-500 font-medium text-sm">
                  Limpiar filtros
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  // Filter Signals
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  sortOption = signal<string>('featured');

  // Derived State: Unique Categories
  categories = computed(() => {
    const cats = new Set(this.productService.products().map(p => p.category));
    return Array.from(cats).sort();
  });

  // Derived State: Filtered & Sorted Products
  filteredProducts = computed(() => {
    let prods = this.productService.products();

    // 1. Filter by Category
    const cat = this.selectedCategory();
    if (cat) {
      prods = prods.filter(p => p.category === cat);
    }

    // 2. Filter by Search Query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      prods = prods.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // 3. Sort
    const sort = this.sortOption();
    return [...prods].sort((a, b) => { // Create copy to avoid mutating original
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0; // featured/original order
      }
    });
  });

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.sortOption.set('featured');
  }
}
