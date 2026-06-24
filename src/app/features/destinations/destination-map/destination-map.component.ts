import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';

import { Destination } from '../../../core/models/destination.model';

@Component({
  selector: 'app-destination-map',
  standalone: true,
  template: `<div #mapContainer class="map" [style.height.px]="height"></div>`,
  styles: [`
    .map {
      width: 100%;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      overflow: hidden;
    }
  `]
})
export class DestinationMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() destination: Destination | null = null;
  @Input() height = 520;
  @ViewChild('mapContainer', { static: true }) private readonly mapContainer?: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.createMap();
    this.renderMarker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('destination' in changes) {
      this.renderMarker();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private createMap(): void {
    if (!this.mapContainer || this.map) {
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView([45.6427, 25.5887], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private renderMarker(): void {
    if (!this.map || !this.destination) {
      return;
    }

    const position: L.LatLngExpression = [this.destination.latitude, this.destination.longitude];

    if (!this.marker) {
      this.marker = L.marker(position).addTo(this.map);
    } else {
      this.marker.setLatLng(position);
    }

    this.marker.bindPopup(`${this.destination.city}, ${this.destination.country}`);
    this.map.setView(position, 8);
    setTimeout(() => this.map?.invalidateSize(), 0);
  }
}
