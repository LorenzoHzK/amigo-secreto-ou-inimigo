import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppAvatarComponent } from '../../shared/components/app-avatar/app-avatar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';

@Component({
  selector: 'app-reveal-page',
  standalone: true,
  imports: [
    AppAvatarComponent,
    BottomNavComponent,
    MobileShellComponent,
    DesktopLayoutComponent,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    UpperCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-shell>
      <header class="flex items-center justify-between px-6 pt-7 pb-4">
        <button
          type="button"
          class="text-neutral focus:ring-primary-300 grid size-11 place-items-center rounded-full bg-white shadow-[0_10px_28px_rgba(26,26,46,0.06)] focus:ring-2 focus:outline-none active:scale-[0.98]"
          aria-label="Abrir menu"
          routerLink="/grupos"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 7h16M4 12h16M4 17h16"
            />
          </svg>
        </button>
        <app-avatar initials="LS" />
      </header>

      <main class="flex-1 px-6 pb-8">
        <section>
          <p
            class="text-primary text-[11px] font-black tracking-[0.2em] uppercase"
          >
            {{ 'Evento exclusivo' | uppercase }}
          </p>
          <h1 class="text-neutral mt-3 text-[2.85rem] leading-none font-black">
            A Grande Revelação
          </h1>
        </section>

        <section
          class="from-primary to-primary-800 shadow-brand-lg mt-7 rounded-[2.15rem] bg-gradient-to-br p-6 text-white"
        >
          <div
            class="grid size-16 place-items-center rounded-full bg-white/16 backdrop-blur"
            aria-hidden="true"
          >
            <svg
              class="size-8"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 11.5v3m-5.5-5V7a5.5 5.5 0 0 1 11 0v2.5M6 9.5h12A1.5 1.5 0 0 1 19.5 11v8A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19v-8A1.5 1.5 0 0 1 6 9.5Z"
              />
            </svg>
          </div>
          <h2 class="mt-6 text-2xl leading-tight font-black">
            Atribuição Secreta
          </h2>
          <p class="mt-3 text-sm leading-6 font-medium text-white/78">
            Sua pessoa designada para a troca de presentes está pronta para ser
            descoberta.
          </p>
          <button
            type="button"
            class="text-primary hover:bg-primary-50 mt-7 min-h-13 w-full rounded-full bg-white px-6 text-sm font-black shadow-[0_12px_28px_rgba(26,26,46,0.14)] transition focus:ring-2 focus:ring-white/80 focus:outline-none active:scale-[0.98]"
            (click)="reveal()"
          >
            {{ revealLabel() }}
          </button>
        </section>

        <div class="my-7 flex items-center gap-4">
          <span class="h-px flex-1 bg-neutral-100"></span>
          <p
            class="text-[10px] font-black tracking-[0.16em] text-neutral-300 uppercase"
          >
            Prévia: após a revelação
          </p>
          <span class="h-px flex-1 bg-neutral-100"></span>
        </div>

        <section
          class="rounded-[2rem] bg-white p-6 text-center shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
          [class.opacity-45]="!isRevealed()"
        >
          <div
            class="bg-secondary-50 mx-auto grid size-14 place-items-center rounded-full text-3xl"
            aria-hidden="true"
          >
            🎉
          </div>
          <div class="mx-auto mt-5 flex justify-center">
            <app-avatar
              initials="SB"
              sizeClass="size-20 text-xl"
              ariaLabel="Avatar de Sophia Bennett"
            />
          </div>
          <p
            class="text-primary mt-5 text-[11px] font-black tracking-[0.18em] uppercase"
          >
            Seu amigo secreto
          </p>
          <h2 class="text-neutral mt-2 text-2xl font-black">Sophia Bennett</h2>
        </section>

        <div class="mt-5 grid grid-cols-2 gap-4">
          <article
            class="rounded-[1.55rem] bg-white p-5 text-center shadow-[0_14px_35px_rgba(26,26,46,0.05)]"
          >
            <p class="text-neutral text-xl font-black">24 Dez</p>
            <p class="mt-1 text-xs font-bold text-neutral-400">Data da Troca</p>
          </article>
          <article
            class="rounded-[1.55rem] bg-white p-5 text-center shadow-[0_14px_35px_rgba(26,26,46,0.05)]"
          >
            <p class="text-neutral text-xl font-black">
              {{ 50 | currency: 'BRL' }}
            </p>
            <p class="mt-1 text-xs font-bold text-neutral-400">
              Limite de Gasto
            </p>
          </article>
        </div>
      </main>

      <app-bottom-nav active="reveal" />
    </app-mobile-shell>

    <app-desktop-layout>
      <section
        class="mx-auto flex min-h-[calc(100dvh-12rem)] max-w-3xl flex-col justify-center text-center"
      >
        <article
          class="rounded-[2.25rem] border border-[#ececf3] bg-white p-10 shadow-[0_24px_70px_rgba(26,26,46,0.075)]"
        >
          <span
            class="bg-primary-50 mx-auto grid size-20 place-items-center rounded-full text-4xl"
            aria-hidden="true"
            >🔒</span
          >
          <p
            class="text-primary mt-7 text-xs font-black tracking-[0.18em] uppercase"
          >
            {{ 'Evento exclusivo' | uppercase }}
          </p>
          <h1 class="text-neutral mt-4 text-5xl leading-tight font-black">
            O grande momento chegou!
          </h1>
          <p
            class="mx-auto mt-5 max-w-xl text-base leading-7 font-medium text-neutral-400"
          >
            Sua atribuição secreta está protegida e pronta para ser revelada com
            privacidade.
          </p>
          <button
            type="button"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-8 rounded-full px-12 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            (click)="reveal()"
          >
            {{ revealLabel() }}
          </button>
        </article>

        <div class="mt-6 grid grid-cols-3 gap-5 text-left">
          <article
            class="rounded-[1.5rem] border border-[#ececf3] bg-white p-5 shadow-sm"
          >
            <p
              class="text-primary text-xs font-black tracking-[0.14em] uppercase"
            >
              Grupo
            </p>
            <p class="text-neutral mt-3 text-lg font-black">
              Natal da Família Silva
            </p>
          </article>
          <article
            class="rounded-[1.5rem] border border-[#ececf3] bg-white p-5 shadow-sm"
          >
            <p
              class="text-primary text-xs font-black tracking-[0.14em] uppercase"
            >
              Orçamento
            </p>
            <p class="text-neutral mt-3 text-lg font-black">
              {{ 50 | currency: 'BRL' }}
            </p>
          </article>
          <article
            class="rounded-[1.5rem] border border-[#ececf3] bg-white p-5 shadow-sm"
          >
            <p
              class="text-primary text-xs font-black tracking-[0.14em] uppercase"
            >
              Revelação
            </p>
            <p class="text-neutral mt-3 text-lg font-black">
              {{ '2024-12-24' | date: 'dd MMM' }}
            </p>
          </article>
        </div>
      </section>
    </app-desktop-layout>
  `,
})
export class RevealPage {
  readonly personalToken = input.required<string>();
  readonly isRevealed = signal<boolean>(false);
  readonly revealLabel = signal<string>('Revelar Resultado');

  reveal(): void {
    this.isRevealed.set(true);
    this.revealLabel.set('Resultado revelado ✓');
  }
}
