import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../core/services/auth.service';
import { passwordStrengthValidator } from '../../../core/validators/custom.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NzButtonModule, NzCardModule, NzFormModule, NzInputModule],
  template: `
    <main class="page-shell">
      <nz-card class="auth-card" nzTitle="Inregistrare">
        <form nz-form [formGroup]="form" (ngSubmit)="submit()">
          <nz-form-item>
            <nz-form-control nzErrorTip="Numele este obligatoriu">
              <input nz-input placeholder="Nume" formControlName="name">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Email invalid">
              <input nz-input type="email" placeholder="Email" formControlName="email">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Minim 6 caractere, litere si cifre">
              <input nz-input type="password" placeholder="Parola" formControlName="password">
            </nz-form-control>
          </nz-form-item>
          <button nz-button nzType="primary" nzBlock>Inregistrare</button>
          <p class="switch-link">Ai deja cont? <a routerLink="/auth/login">Login</a></p>
        </form>
      </nz-card>
    </main>
  `,
  styles: [`
    .switch-link {
      margin: 16px 0 0;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator()]]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    this.auth.register(name, email, password);
    this.message.success('Cont creat');
    void this.router.navigateByUrl('/destinations');
  }
}
