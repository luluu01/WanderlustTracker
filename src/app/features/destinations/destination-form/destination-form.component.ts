import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { Destination } from '../../../core/models/destination.model';
import { dateRangeValidator } from '../../../core/validators/custom.validators';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-control nzErrorTip="Oras obligatoriu">
          <input nz-input placeholder="Oras" formControlName="city">
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control nzErrorTip="Tara obligatorie">
          <input nz-input placeholder="Tara" formControlName="country">
        </nz-form-control>
      </nz-form-item>
      <div class="date-grid">
        <nz-form-item>
          <nz-form-control nzErrorTip="Data obligatorie">
            <input nz-input type="date" formControlName="startDate">
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Data obligatorie">
            <input nz-input type="date" formControlName="endDate">
          </nz-form-control>
        </nz-form-item>
      </div>
      <div class="date-grid">
        <nz-form-item>
          <nz-form-control nzErrorTip="Status obligatoriu">
            <nz-select formControlName="status" nzPlaceHolder="Status">
              <nz-option nzValue="planned" nzLabel="Planificat" />
              <nz-option nzValue="visited" nzLabel="Vizitat" />
              <nz-option nzValue="wishlist" nzLabel="Wishlist" />
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Buget invalid">
            <input nz-input type="number" placeholder="Buget estimat" formControlName="budget">
          </nz-form-control>
        </nz-form-item>
      </div>
      <div class="date-grid">
        <nz-form-item>
          <nz-form-control nzErrorTip="Latitudine invalida">
            <input nz-input type="number" placeholder="Latitudine" formControlName="latitude">
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Longitudine invalida">
            <input nz-input type="number" placeholder="Longitudine" formControlName="longitude">
          </nz-form-control>
        </nz-form-item>
      </div>
      <nz-form-item>
        <nz-form-control>
          <textarea nz-input rows="3" placeholder="Note" formControlName="notes"></textarea>
        </nz-form-control>
      </nz-form-item>
      @if (form.hasError('dateRange')) {
        <p class="form-error">Data de final trebuie sa fie dupa data de start.</p>
      }
      <button nz-button nzType="primary" [disabled]="form.invalid">Salveaza</button>
    </form>
  `,
  styles: [`
    .date-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .form-error {
      margin: 0 0 12px;
      color: #cf1322;
    }
  `]
})
export class DestinationFormComponent implements OnChanges {
  private readonly fb = inject(NonNullableFormBuilder);

  @Input() destination: Destination | null = null;
  @Output() readonly save = new EventEmitter<Destination | Omit<Destination, 'id'>>();

  protected readonly form = this.fb.group({
    city: ['', [Validators.required]],
    country: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: ['planned' as Destination['status'], [Validators.required]],
    budget: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
    latitude: [45.6427, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [25.5887, [Validators.required, Validators.min(-180), Validators.max(180)]]
  }, { validators: [dateRangeValidator('startDate', 'endDate')] });

  ngOnChanges(changes: SimpleChanges): void {
    if ('destination' in changes) {
      this.form.reset(this.destination ?? {
        city: '',
        country: '',
        startDate: '',
        endDate: '',
        status: 'planned',
        budget: 0,
        notes: '',
        latitude: 45.6427,
        longitude: 25.5887
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit(this.destination ? { ...value, id: this.destination.id } : value);
  }
}
