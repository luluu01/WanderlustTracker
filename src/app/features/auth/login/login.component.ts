import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NzButtonModule, NzCardModule, NzCheckboxModule, NzFormModule, NzInputModule],
  template: `
    <main class="page-shell">
      <nz-card class="auth-card" nzTitle="Login">
        <form nz-form [formGroup]="form" (ngSubmit)="submit()">
          <nz-form-item>
            <nz-form-control nzErrorTip="Email invalid">
              <input nz-input type="email" placeholder="Email" formControlName="email">
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Parola este obligatorie">
              <input nz-input type="password" placeholder="Parola" formControlName="password">
            </nz-form-control>
          </nz-form-item>
          <label nz-checkbox formControlName="remember">Remember me</label>
          <button nz-button nzType="primary" nzBlock class="submit-button">Login</button>
          <p class="switch-link">Nu ai cont? <a routerLink="/auth/register">Inregistrare</a></p>
        </form>
      </nz-card>
    </main>
  `,
  styles: [`
    .submit-button {
      margin-top: 18px;
    }

    .switch-link {
      margin: 16px 0 0;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  protected readonly form = this.fb.group({
    email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
    password: ['cityslicka', [Validators.required]],
    remember: [true]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.form.getRawValue();
    const ok = this.auth.login(email, password, remember);

    if (ok) {
      this.message.success('Autentificare reusita');
      void this.router.navigateByUrl('/destinations');
    }
  }
}
