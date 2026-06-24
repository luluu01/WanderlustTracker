export interface Destination {
  id: number;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'visited' | 'wishlist';
  budget: number;
  notes: string;
  latitude: number;
  longitude: number;
}
