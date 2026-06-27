import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Página não encontrada</p>
      <h1 class="text-neutral mt-4 text-6xl font-black">404</h1>
      <p class="mt-4 max-w-sm text-sm leading-7 font-medium text-neutral-400">
        O link que você acessou não existe ou foi removido.
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
export class NotFoundPage {}
