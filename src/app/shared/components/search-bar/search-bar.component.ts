import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, NzInputModule],
  template: `
    <input
      nz-input
      type="search"
      [placeholder]="placeholder()"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)">
  `,
  styles: [`
    :host {
      display: block;
      width: min(360px, 100%);
    }
  `]
})
export class SearchBarComponent {
  readonly value = input('');
  readonly placeholder = input('Cauta');
  readonly valueChange = output<string>();
}
