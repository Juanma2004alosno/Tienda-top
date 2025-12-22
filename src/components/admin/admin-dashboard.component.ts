
import { Component, inject, signal } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-slate-800">Panel de Control (Dueño)</h2>
          <p class="text-slate-500">Gestiona el inventario de tu tienda</p>
        </div>
        <button 
          (click)="toggleForm()" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center space-x-2">
          <span>{{ showForm() ? 'Cancelar' : 'Añadir Producto' }}</span>
        </button>
      </div>

      <!-- Add/Edit Form -->
      @if (showForm()) {
        <div class="bg-white p-6 rounded-xl shadow-md border border-indigo-100 mb-8 animate-fade-in-down">
          <h3 class="text-xl font-bold mb-4 text-indigo-700">{{ isEditing() ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
              <input type="text" [(ngModel)]="currentProduct.name" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Precio (€)</label>
              <input type="number" [(ngModel)]="currentProduct.price" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select [(ngModel)]="currentProduct.category" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900">
                <option value="Tecnología">Tecnología</option>
                <option value="Ropa">Ropa</option>
                <option value="Hogar">Hogar</option>
                <option value="Calzado">Calzado</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">URL de Imagen</label>
              <input type="text" [(ngModel)]="currentProduct.image" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" placeholder="https://...">
            </div>
            
            <div class="md:col-span-2">
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium text-slate-700">Descripción</label>
                <button 
                  (click)="generateDescription()" 
                  [disabled]="!currentProduct.name || isGenerating()"
                  class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition disabled:opacity-50 flex items-center space-x-1">
                  @if (isGenerating()) {
                    <svg class="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  } @else {
                    <span>✨ Generar con IA</span>
                  }
                </button>
              </div>
              <textarea [(ngModel)]="currentProduct.description" rows="3" class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900"></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
             <button (click)="resetForm()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition">Cancelar</button>
             <button (click)="saveProduct()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded shadow transition">Guardar</button>
          </div>
        </div>
      }

      <!-- Products Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                <th class="p-4">Producto</th>
                <th class="p-4">Categoría</th>
                <th class="p-4">Precio</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (product of productService.products(); track product.id) {
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-4 flex items-center space-x-3">
                    <img [src]="product.image" class="h-10 w-10 rounded object-cover bg-slate-200">
                    <div>
                      <div class="font-bold text-slate-800">{{ product.name }}</div>
                      <div class="text-xs text-slate-500 truncate max-w-xs">{{ product.description }}</div>
                    </div>
                  </td>
                  <td class="p-4 text-slate-600 text-sm">{{ product.category }}</td>
                  <td class="p-4 font-medium text-slate-800">{{ product.price }} €</td>
                  <td class="p-4 text-right space-x-2">
                    <button (click)="editProduct(product)" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Editar</button>
                    <button (click)="deleteProduct(product.id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Eliminar</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="p-8 text-center text-slate-400">No hay productos en la base de datos local.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 0.3s ease-out;
    }
  `]
})
export class AdminDashboardComponent {
  productService = inject(ProductService);
  geminiService = inject(GeminiService);

  showForm = signal(false);
  isEditing = signal(false);
  isGenerating = signal(false);

  // Default empty product
  defaultProduct = {
    id: '',
    name: '',
    description: '',
    price: 0,
    image: 'https://picsum.photos/400/400',
    category: 'General'
  };

  currentProduct: Product = { ...this.defaultProduct };

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.resetForm();
  }

  resetForm() {
    this.currentProduct = { ...this.defaultProduct };
    this.isEditing.set(false);
    this.showForm.set(false);
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product };
    this.isEditing.set(true);
    this.showForm.set(true);
  }

  deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id);
    }
  }

  saveProduct() {
    if (!this.currentProduct.name || this.currentProduct.price <= 0) {
      alert('Por favor completa el nombre y un precio válido.');
      return;
    }

    if (this.isEditing()) {
      this.productService.updateProduct(this.currentProduct);
    } else {
      const { id, ...newProd } = this.currentProduct;
      this.productService.addProduct(newProd);
    }
    this.resetForm();
  }

  async generateDescription() {
    if (!this.currentProduct.name) return;
    this.isGenerating.set(true);
    const desc = await this.geminiService.generateProductDescription(this.currentProduct.name);
    this.currentProduct.description = desc;
    this.isGenerating.set(false);
  }
}
