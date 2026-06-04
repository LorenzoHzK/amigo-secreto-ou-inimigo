import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-base-200/50 bg-base-100/80 backdrop-blur-md transition-all duration-300">
      <div class="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 min-h-16">
        <!-- Logo -->
        <div class="navbar-start">
          <a routerLink="/" class="flex items-center gap-2 text-xl font-bold tracking-tight text-primary hover:opacity-90 transition-opacity">
            <span class="text-2xl animate-bounce-subtle">🎁</span>
            <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-display">
              Amigo Secreto
            </span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 hidden sm:inline-block">
              ou Inimigo
            </span>
          </a>
        </div>

        <!-- Links Desktop -->
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1 gap-2 font-medium">
            <li>
              <a 
                routerLink="/" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{exact: true}"
                class="rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                Criar Grupo
              </a>
            </li>
            <li>
              <a 
                routerLink="/como-funciona" 
                routerLinkActive="active"
                class="rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                Como Funciona
              </a>
            </li>
            <li>
              <a 
                routerLink="/sobre" 
                routerLinkActive="active"
                class="rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                Sobre
              </a>
            </li>
          </ul>
        </div>

        <!-- Botão Ação / Hambúrguer Mobile -->
        <div class="navbar-end gap-2">
          <!-- Desktop Action -->
          <a 
            routerLink="/" 
            class="btn btn-primary btn-sm rounded-brand shadow-brand hover:shadow-brand-lg px-4 hidden lg:inline-flex"
          >
            Novo Sorteio
          </a>

          <!-- Mobile Hamburger Toggle -->
          <label 
            for="app-drawer" 
            class="btn btn-ghost btn-circle hover:bg-base-200/60 lg:hidden" 
            aria-label="Abrir menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .menu li a.active {
      background-color: var(--color-primary);
      color: var(--color-primary-content, #ffffff);
    }
    .rounded-brand {
      border-radius: var(--radius-brand, 9999px);
    }
  `]
})
export class HeaderComponent {}
