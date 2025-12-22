
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // API KEY is process.env.API_KEY as per instructions
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async generateInvoiceEmail(customerName: string, shippingDetails: string, items: CartItem[], total: number): Promise<string> {
    const itemsList = items.map(i => `- ${i.name} (x${i.quantity}): ${(i.price * i.quantity).toFixed(2)} €`).join('\n');
    
    const prompt = `
      Actúa como un sistema de facturación profesional y automático para el negocio "Tienda".
      Genera el cuerpo de un correo electrónico formal dirigido a "${customerName}".
      
      Datos de envío y facturación del cliente:
      ${shippingDetails}
      
      Detalles de la compra:
      ${itemsList}
      
      Total a pagar: ${total.toFixed(2)} €
      
      INSTRUCCIONES:
      1. El correo debe confirmar la recepción del pedido con un número de pedido inventado (ej. #ORD-2024-XXXX).
      2. Incluye una sección clara titulada "FACTURA SIMPLIFICADA" con los items, precios y el total.
      3. Incluye explícitamente la dirección de envío proporcionada en el resumen.
      4. Añade un texto de agradecimiento personalizado de parte de "Juanma" (el dueño).
      5. Mantén un tono muy profesional, elegante y corporativo.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error('Error generating invoice:', error);
      return "Estimado cliente,\n\nGracias por su compra en Tienda. Hemos recibido su pedido correctamente y será enviado a la dirección proporcionada.\n\nAtentamente,\nJuanma";
    }
  }

  async generateProductDescription(productName: string): Promise<string> {
    const prompt = `Escribe una descripción corta, atractiva y vendedora (máximo 2 frases) para un producto llamado "${productName}" en venta en "Tienda".`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      return "Descripción pendiente de generar.";
    }
  }
}
