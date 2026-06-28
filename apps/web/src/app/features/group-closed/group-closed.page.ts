import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-group-closed-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span class="text-6xl" aria-hidden="true">🔒</span>
      <p class="text-primary mt-6 text-xs font-black tracking-[0.18em] uppercase">Grupo encerrado</p>
      <h1 class="text-neutral mt-4 text-4xl font-black">Sorteio já realizado</h1>
      <p class="mt-4 max-w-sm text-sm leading-7 font-medium text-neutral-400">
        Este grupo já realizou o sorteio. Novos participantes não podem mais entrar.
        Se você já participou, use o seu link individual para revelar o seu par.
      </p>
      <a
        routerLink="/"
        class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-8 rounded-full px-8 py-4 text-sm font-extrabold text-white transition"
      >
        Voltar ao início
      </a>
    </section>
  `,
})
export class GroupClosedPage {}
