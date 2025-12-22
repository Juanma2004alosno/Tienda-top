
import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer' | 'guest';
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  private users: User[] = []; // Mock database for registered users

  constructor() {
    // Check localStorage for persisted session
    const savedSession = localStorage.getItem('currentUser');
    if (savedSession) {
      this.currentUser.set(JSON.parse(savedSession));
    }

    // Load registered users from "database"
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  register(username: string, email: string, password: string): boolean {
    if (this.users.some(u => u.username === username)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role: 'customer'
    };

    this.users.push(newUser);
    this.saveUsers();
    this.updateSession(newUser);
    return true;
  }

  login(username: string, password?: string, secretCode?: string): boolean {
    // Admin Login logic
    if (username === 'admin') {
      // Check secret code for admin
      if (secretCode === 'SECRET123') {
        const adminUser: User = { 
          id: '1', 
          username: 'Dueño', 
          role: 'admin', 
          email: 'admin@tienda.com' 
        };
        this.updateSession(adminUser);
        return true;
      }
      return false;
    }

    // Customer Login logic
    const foundUser = this.users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      this.updateSession(foundUser);
      return true;
    }
    
    return false;
  }

  loginAsGuest() {
    const user: User = { id: 'guest-' + Date.now(), username: 'Invitado', role: 'guest' };
    this.updateSession(user);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  updateProfile(updatedData: Partial<User>) {
    const current = this.currentUser();
    if (!current) return;

    // Merge current data with updates
    const updatedUser = { ...current, ...updatedData };
    
    // Update session state
    this.updateSession(updatedUser);

    // Update in "database" if user is registered (not guest or hardcoded admin)
    if (current.role === 'customer') {
      const index = this.users.findIndex(u => u.id === current.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.saveUsers();
      }
    }
  }

  private updateSession(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private saveUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(this.users));
  }
}
