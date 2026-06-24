import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NzButtonModule, NzLayoutModule],
  template: `
    <nz-layout class="app-layout">
      <nz-header class="app-header">
        <a class="brand" [routerLink]="auth.currentUser() ? '/destinations' : '/auth/login'">Wanderlust Tracker</a>
        <nav class="nav-actions">
          @if (auth.currentUser(); as user) {
            <span class="user-email">{{ user.email }}</span>
            <button nz-button nzType="default" (click)="auth.logout()">Logout</button>
          } @else {
            <a nz-button nzType="default" routerLink="/auth/login">Login</a>
            <a nz-button nzType="primary" routerLink="/auth/register">Inregistrare</a>
          }
        </nav>
      </nz-header>
      <nz-content>
        <router-outlet />
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
    }

    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-inline: 24px;
      background: #12233d;
    }

    .brand {
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
    }

    .nav-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .user-email {
      color: #dbe7f6;
      font-size: 14px;
    }

    @media (max-width: 560px) {
      .app-header {
        height: auto;
        min-height: 64px;
        flex-wrap: wrap;
        gap: 10px;
        padding-block: 10px;
      }

      .nav-actions {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
}
