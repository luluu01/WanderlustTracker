import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'wanderlust.session';
  private readonly user = signal<User | null>(null);

  readonly currentUser = computed(() => this.user());
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor(private readonly router: Router) {}

  login(email: string, password: string, remember: boolean): boolean {
    if (!email || !password) {
      return false;
    }

    const user: User = {
      id: this.createUserId(email),
      email,
      name: email.split('@')[0] || 'Traveler',
      token: crypto.randomUUID()
    };

    this.user.set(user);
    this.persist({ user, remember });
    return true;
  }

  register(name: string, email: string, password: string): boolean {
    if (!name || !email || !password) {
      return false;
    }

    return this.login(email, password, true);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this.user.set(null);
    void this.router.navigateByUrl('/auth/login');
  }

  private persist(session: { user: User; remember: boolean }): void {
    const target = session.remember ? localStorage : sessionStorage;
    const other = session.remember ? sessionStorage : localStorage;
    other.removeItem(this.storageKey);
    target.setItem(this.storageKey, JSON.stringify(session));
  }

  private createUserId(email: string): number {
    return [...email.toLowerCase()].reduce((hash, char) => {
      return Math.imul(31, hash) + char.charCodeAt(0) | 0;
    }, 7);
  }
}
