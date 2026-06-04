import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="menu p-6 w-80 min-h-full bg-base-100 text-base-content flex flex-col justify-between border-r border-base-200/50 shadow-2xl">
      <div>
        <!-- Sidenav Header (Logo & Close Button) -->
        <div class="flex items-center justify-between mb-8">
          <a routerLink="/" (click)="closeDrawer()" class="flex items-center gap-2 text-lg font-bold tracking-tight text-primary">
            <span class="text-xl">🎁</span>
            <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-display">
              Amigo Secreto
            </span>
          </a>
          
          <!-- Close Button -->
          <label for="app-drawer" class="btn btn-ghost btn-circle btn-sm" aria-label="Fechar menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </label>
        </div>

        <!-- Navigation Links -->
        <ul class="space-y-2 font-medium">
          <li>
            <a 
              routerLink="/" 
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              (click)="closeDrawer()"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Criar Grupo
            </a>
          </li>
          <li>
            <a 
              routerLink="/como-funciona" 
              routerLinkActive="active"
              (click)="closeDrawer()"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Como Funciona
            </a>
          </li>
          <li>
            <a 
              routerLink="/sobre" 
              routerLinkActive="active"
              (click)="closeDrawer()"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sobre
            </a>
          </li>
        </ul>
      </div>

      <!-- Sidenav Footer / Extra Info -->
      <div class="mt-auto pt-6 border-t border-base-200/50">
        <p class="text-xs text-neutral-400 text-center">
          Organize seus sorteios de forma rápida e segura.
        </p>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .menu li a.active {
      background-color: var(--color-primary);
      color: var(--color-primary-content, #ffffff);
    }
  `]
})
export class SidenavComponent {
  closeDrawer() {
    const checkbox = document.getElementById('app-drawer') as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}
