import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { Destination } from '../models/destination.model';
import { AuthService } from './auth.service';

const SEED_DESTINATIONS: Destination[] = [
  {
    id: 1,
    city: 'Brasov',
    country: 'Romania',
    startDate: '2026-07-05',
    endDate: '2026-07-08',
    status: 'planned',
    budget: 360,
    notes: 'Centrul vechi, Tampa si cafea dimineata.',
    latitude: 45.6427,
    longitude: 25.5887
  },
  {
    id: 2,
    city: 'Lisbon',
    country: 'Portugal',
    startDate: '2026-08-12',
    endDate: '2026-08-18',
    status: 'wishlist',
    budget: 840,
    notes: 'Tramvaiul 28, Alfama si apus la Miradouro.',
    latitude: 38.7223,
    longitude: -9.1393
  },
  {
    id: 3,
    city: 'Vienna',
    country: 'Austria',
    startDate: '2026-05-01',
    endDate: '2026-05-04',
    status: 'visited',
    budget: 520,
    notes: 'Muzee, cafea vieneza si plimbare pe Ringstrasse.',
    latitude: 48.2082,
    longitude: 16.3738
  }
];

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private readonly auth = inject(AuthService);
  private readonly items = signal<Destination[]>([]);

  readonly destinations = computed(() => this.items());

  constructor() {
    effect(() => {
      this.items.set(this.restoreForCurrentUser());
    });
  }

  add(destination: Omit<Destination, 'id'>): void {
    const nextId = Math.max(0, ...this.items().map((item) => item.id)) + 1;
    this.save([...this.items(), { ...destination, id: nextId }]);
  }

  update(destination: Destination): void {
    this.save(this.items().map((item) => item.id === destination.id ? destination : item));
  }

  remove(id: number): void {
    this.save(this.items().filter((item) => item.id !== id));
  }

  private restoreForCurrentUser(): Destination[] {
    const key = this.currentStorageKey();

    if (!key) {
      return [];
    }

    const stored = localStorage.getItem(key);

    if (!stored) {
      return this.shouldUseDemoSeed() ? SEED_DESTINATIONS : [];
    }

    try {
      return (JSON.parse(stored) as Partial<Destination>[]).map((destination, index) => ({
        id: destination.id ?? index + 1,
        city: destination.city ?? 'Unknown',
        country: destination.country ?? 'Unknown',
        startDate: destination.startDate ?? new Date().toISOString().slice(0, 10),
        endDate: destination.endDate ?? destination.startDate ?? new Date().toISOString().slice(0, 10),
        status: destination.status ?? 'planned',
        budget: destination.budget ?? 0,
        notes: destination.notes ?? '',
        latitude: destination.latitude ?? 45.6427,
        longitude: destination.longitude ?? 25.5887
      }));
    } catch {
      return this.shouldUseDemoSeed() ? SEED_DESTINATIONS : [];
    }
  }

  private save(destinations: Destination[]): void {
    const key = this.currentStorageKey();

    this.items.set(destinations);

    if (key) {
      localStorage.setItem(key, JSON.stringify(destinations));
    }
  }

  private currentStorageKey(): string | null {
    const email = this.auth.currentUser()?.email.trim().toLowerCase();
    return email ? `wanderlust.destinations.${email}` : null;
  }

  private shouldUseDemoSeed(): boolean {
    return this.auth.currentUser()?.email.trim().toLowerCase() === 'eve.holt@reqres.in';
  }
}
