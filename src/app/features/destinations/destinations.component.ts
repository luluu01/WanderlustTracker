import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { differenceInCalendarDays, format } from 'date-fns';

import { Destination } from '../../core/models/destination.model';
import { DestinationService } from '../../core/services/destination.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { DestinationFormComponent } from './destination-form/destination-form.component';
import { DestinationMapComponent } from './destination-map/destination-map.component';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzCardModule,
    NzModalModule,
    NzPopconfirmModule,
    NzTagModule,
    NzTableModule,
    SearchBarComponent,
    DestinationFormComponent,
    DestinationMapComponent,
    DecimalPipe
  ],
  template: `
    <main class="page-shell destinations-page">
      <section class="toolbar">
        <div>
          <h1>Destinatii</h1>
          <p>{{ destinationService.destinations().length }} calatorii salvate · {{ totalBudget() }} € buget total</p>
        </div>
        <div class="toolbar-actions">
          <app-search-bar
            [value]="query()"
            placeholder="Cauta destinatii"
            (valueChange)="query.set($event)" />
          <button nz-button nzType="primary" (click)="openCreate()">Adauga destinatie</button>
        </div>
      </section>

      <section class="content-grid">
        <nz-card nzTitle="Destinatii">
          <div class="stats-row">
            <div class="stat">
              <span>Planificate</span>
              <strong>{{ countByStatus('planned') }}</strong>
            </div>
            <div class="stat">
              <span>Vizitate</span>
              <strong>{{ countByStatus('visited') }}</strong>
            </div>
            <div class="stat">
              <span>Wishlist</span>
              <strong>{{ countByStatus('wishlist') }}</strong>
            </div>
          </div>
          <nz-table
            #table
            [nzData]="filteredDestinations()"
            [nzPageSize]="5"
            nzSize="middle">
            <thead>
              <tr>
                <th nzColumnKey="city" [nzSortFn]="sortByCity">Oras</th>
                <th nzColumnKey="country" [nzSortFn]="sortByCountry">Tara</th>
                <th>Status</th>
                <th>Perioada</th>
                <th nzColumnKey="budget" [nzSortFn]="sortByBudget">Buget</th>
                <th>Actiuni</th>
              </tr>
            </thead>
            <tbody>
              @for (destination of table.data; track destination.id) {
                <tr [class.selected]="selected()?.id === destination.id" (click)="select(destination)">
                  <td>{{ destination.city }}</td>
                  <td>{{ destination.country }}</td>
                  <td>
                    <nz-tag [nzColor]="statusColor(destination.status)">
                      {{ statusLabel(destination.status) }}
                    </nz-tag>
                  </td>
                  <td>
                    {{ formatDate(destination.startDate) }} - {{ formatDate(destination.endDate) }}
                    <span class="duration">({{ tripDays(destination) }} zile)</span>
                  </td>
                  <td>{{ destination.budget | number:'1.0-0' }} €</td>
                  <td class="actions" (click)="$event.stopPropagation()">
                    <button nz-button nzType="link" (click)="openEdit(destination)">Editeaza</button>
                    <button
                      nz-button
                      nzType="link"
                      nzDanger
                      nz-popconfirm
                      nzPopconfirmTitle="Stergi destinatia?"
                      (nzOnConfirm)="remove(destination.id)">
                      Sterge
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </nz-table>
          @if (filteredDestinations().length === 0) {
            <p class="empty-state">Nu exista destinatii pentru cautarea curenta.</p>
          }
        </nz-card>

        <nz-card class="map-card" [nzTitle]="selectedTitle()">
          <app-destination-map [destination]="selected()" [height]="mapHeight()" />
          @if (selected()) {
            <div class="selected-details">
              <nz-tag [nzColor]="statusColor(selected()?.status ?? 'planned')">
                {{ statusLabel(selected()?.status ?? 'planned') }}
              </nz-tag>
              <span>{{ tripDays(selected()) }} zile</span>
              <span>{{ selected()?.budget | number:'1.0-0' }} €</span>
            </div>
            <p class="notes">{{ selected()?.notes || 'Fara note pentru aceasta destinatie.' }}</p>
          }
        </nz-card>
      </section>

      <nz-modal
        [nzVisible]="modalOpen()"
        [nzTitle]="editing() ? 'Editeaza destinatia' : 'Adauga destinatie'"
        [nzFooter]="null"
        (nzOnCancel)="closeModal()">
        <ng-container *nzModalContent>
          <app-destination-form [destination]="editing()" (save)="saveDestination($event)" />
        </ng-container>
      </nz-modal>
    </main>
  `,
  styles: [`
    .destinations-page {
      max-width: 1320px;
      margin-inline: auto;
    }

    .toolbar h1 {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .toolbar p {
      margin: 4px 0 0;
      color: #60708a;
    }

    .toolbar-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(420px, 0.9fr);
      gap: 18px;
      align-items: start;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }

    .stat {
      padding: 12px;
      border: 1px solid #e6ebf2;
      border-radius: 8px;
      background: #f8fbff;
    }

    .stat span {
      display: block;
      color: #65758c;
      font-size: 12px;
    }

    .stat strong {
      font-size: 22px;
    }

    .selected {
      background: #e6f4ff;
    }

    .duration {
      display: block;
      color: #718096;
      font-size: 12px;
    }

    .actions {
      white-space: nowrap;
    }

    .map-card {
      min-width: 0;
    }

    .selected-details {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      margin-top: 14px;
      color: #4b5a70;
    }

    .notes {
      margin: 14px 0 0;
      color: #4b5a70;
    }

    .empty-state {
      margin: 16px 0 0;
      color: #718096;
      text-align: center;
    }

    @media (max-width: 900px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .toolbar-actions {
        width: 100%;
        justify-content: stretch;
      }
    }
  `]
})
export class DestinationsComponent {
  protected readonly destinationService = inject(DestinationService);
  private readonly message = inject(NzMessageService);

  protected readonly query = signal('');
  protected readonly selected = signal<Destination | null>(this.destinationService.destinations()[0] ?? null);
  protected readonly editing = signal<Destination | null>(null);
  protected readonly modalOpen = signal(false);

  constructor() {
    effect(() => {
      const destinations = this.destinationService.destinations();
      const selected = this.selected();

      if (!selected || !destinations.some((destination) => destination.id === selected.id)) {
        this.selected.set(destinations[0] ?? null);
      }
    });
  }

  protected readonly filteredDestinations = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();

    if (!normalizedQuery) {
      return this.destinationService.destinations();
    }

    return this.destinationService.destinations().filter((destination) =>
      `${destination.city} ${destination.country} ${destination.notes}`.toLowerCase().includes(normalizedQuery)
    );
  });

  protected readonly selectedTitle = computed(() => {
    const selected = this.selected();
    return selected ? `${selected.city}, ${selected.country}` : 'Harta';
  });

  protected readonly totalBudget = computed(() =>
    this.destinationService.destinations().reduce((sum, destination) => sum + destination.budget, 0)
  );

  protected readonly mapHeight = computed(() => this.selected() ? 540 : 460);

  protected readonly sortByCity = (a: Destination, b: Destination): number => a.city.localeCompare(b.city);
  protected readonly sortByCountry = (a: Destination, b: Destination): number => a.country.localeCompare(b.country);
  protected readonly sortByBudget = (a: Destination, b: Destination): number => a.budget - b.budget;

  protected select(destination: Destination): void {
    this.selected.set(destination);
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  protected openEdit(destination: Destination): void {
    this.editing.set(destination);
    this.modalOpen.set(true);
  }

  protected saveDestination(destination: Destination | Omit<Destination, 'id'>): void {
    if ('id' in destination) {
      this.destinationService.update(destination);
      this.selected.set(destination);
      this.message.success('Destinatie actualizata');
    } else {
      this.destinationService.add(destination);
      const created = this.destinationService.destinations().at(-1) ?? null;
      this.selected.set(created);
      this.message.success('Destinatie adaugata');
    }

    this.closeModal();
  }

  protected remove(id: number): void {
    this.destinationService.remove(id);
    const next = this.destinationService.destinations()[0] ?? null;

    if (this.selected()?.id === id) {
      this.selected.set(next);
    }

    this.message.success('Destinatie stearsa');
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
    this.editing.set(null);
  }

  protected formatDate(value: string): string {
    return format(new Date(value), 'dd.MM.yyyy');
  }

  protected tripDays(destination: Destination | null): number {
    if (!destination) {
      return 0;
    }

    return differenceInCalendarDays(new Date(destination.endDate), new Date(destination.startDate)) + 1;
  }

  protected countByStatus(status: Destination['status']): number {
    return this.destinationService.destinations().filter((destination) => destination.status === status).length;
  }

  protected statusLabel(status: Destination['status']): string {
    const labels: Record<Destination['status'], string> = {
      planned: 'Planificat',
      visited: 'Vizitat',
      wishlist: 'Wishlist'
    };

    return labels[status];
  }

  protected statusColor(status: Destination['status']): string {
    const colors: Record<Destination['status'], string> = {
      planned: 'blue',
      visited: 'green',
      wishlist: 'purple'
    };

    return colors[status];
  }
}
