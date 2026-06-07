import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppAvatarComponent } from '../../shared/components/app-avatar/app-avatar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    AppAvatarComponent,
    BottomNavComponent,
    MobileShellComponent,
    DesktopLayoutComponent,
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

      <main class="flex flex-1 flex-col px-7 pt-2 pb-8">
        <section
          class="flex flex-1 flex-col items-center justify-center text-center"
        >
          <div class="relative mb-10 grid size-48 place-items-center">
            <div
              class="bg-primary-100 absolute inset-5 rounded-[3rem] blur-2xl"
            ></div>
            <div
              class="relative grid size-40 place-items-center rounded-[2.6rem] bg-white shadow-[0_28px_60px_rgba(108,59,255,0.18)]"
            >
              <div
                class="from-primary to-secondary shadow-brand-lg grid size-28 place-items-center rounded-[2rem] bg-linear-to-br text-6xl"
                aria-hidden="true"
              >
                🎁
              </div>
            </div>
          </div>

          <h1
            class="text-neutral text-[2.78rem] leading-[0.95] font-black tracking-normal"
          >
            O Amigo Secreto
            <span class="text-primary block">Descomplicado</span>
          </h1>

          <p
            class="mt-6 max-w-[310px] text-[1rem] leading-7 font-medium text-neutral-400"
          >
            Crie sorteios em segundos, organize listas de desejos e deixe a
            RevealMe cuidar de todo o mistério. O jeito moderno de celebrar.
          </p>

          <a
            routerLink="/criar"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-10 inline-flex min-h-14 w-full items-center justify-center rounded-full px-8 text-base font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Novo grupo
          </a>
        </section>
      </main>

      <app-bottom-nav active="reveal" />
    </app-mobile-shell>

    <app-desktop-layout>
      <section class="mx-auto max-w-5xl text-center">
        <span
          class="border-primary-100 bg-primary-50 text-primary inline-flex rounded-full border px-4 py-2 text-xs font-black tracking-[0.16em] uppercase"
        >
          Nova curadoria criativa
        </span>
        <h1
          class="text-neutral mx-auto mt-8 max-w-4xl text-7xl leading-[0.92] font-black"
        >
          Amigo Secreto
          <span class="text-primary block">ou Inimigo</span>
        </h1>
        <p
          class="mx-auto mt-7 max-w-2xl text-lg leading-8 font-medium text-neutral-400"
        >
          Crie trocas memoráveis com sorteios inteligentes, experiências de
          revelação e curadoria visual para qualquer celebração.
        </p>
        <div class="mt-10 flex justify-center gap-4">
          <a
            routerLink="/criar"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 rounded-full px-8 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none"
          >
            Criar grupo
          </a>
          <a
            routerLink="/revelar/alex-personal-token"
            class="text-neutral hover:border-primary-200 hover:text-primary focus:ring-primary-300 rounded-full border border-[#ececf3] bg-white px-8 py-4 text-base font-extrabold shadow-sm transition focus:ring-2 focus:outline-none"
          >
            Ver demonstração
          </a>
        </div>
      </section>

      <section class="mt-16 grid grid-cols-3 gap-6">
        <article
          class="rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
        >
          <span
            class="bg-primary-50 grid size-14 place-items-center rounded-2xl text-2xl"
            aria-hidden="true"
            >⚡</span
          >
          <h2 class="text-neutral mt-6 text-2xl font-black">
            Sorteio Inteligente
          </h2>
          <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">
            Distribuição automática, justa e sem repetições para todos os
            participantes.
          </p>
        </article>
        <article
          class="rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
        >
          <span
            class="bg-secondary-50 grid size-14 place-items-center rounded-2xl text-2xl"
            aria-hidden="true"
            >🎉</span
          >
          <h2 class="text-neutral mt-6 text-2xl font-black">O Grande Reveal</h2>
          <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">
            Uma revelação elegante para transformar o sorteio em um momento
            especial.
          </p>
        </article>
        <article
          class="rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
        >
          <span
            class="bg-accent-50 grid size-14 place-items-center rounded-2xl text-2xl"
            aria-hidden="true"
            >😈</span
          >
          <h2 class="text-neutral mt-6 text-2xl font-black">Modo Inimigo</h2>
          <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">
            Regras criativas e desafios leves para quem quer uma troca mais
            divertida.
          </p>
        </article>
      </section>

      <section
        id="como-funciona"
        class="mt-20 grid grid-cols-[1fr_0.9fr] items-center gap-12"
      >
        <div
          class="from-primary-100 to-secondary-100 relative min-h-[430px] overflow-hidden rounded-[2.5rem] bg-linear-to-br via-white p-8 shadow-[0_24px_70px_rgba(108,59,255,0.14)]"
        >
          <div
            class="absolute top-10 left-10 grid size-44 place-items-center rounded-[2.5rem] bg-white text-7xl shadow-2xl"
            aria-hidden="true"
          >
            🎁
          </div>
          <div
            class="absolute right-10 bottom-10 w-72 rounded-[2rem] bg-white p-6 shadow-2xl"
          >
            <p
              class="text-primary text-xs font-black tracking-[0.16em] uppercase"
            >
              Reveal pronto
            </p>
            <p class="text-neutral mt-3 text-3xl font-black">24 Dez</p>
            <p class="mt-2 text-sm font-bold text-neutral-400">
              A troca mais organizada do ano.
            </p>
          </div>
        </div>
        <div>
          <h2 class="text-neutral text-5xl leading-tight font-black">
            Chega de papéis amassados e sorteios repetidos.
          </h2>
          <div class="mt-8 space-y-4">
            <p
              class="text-neutral rounded-2xl bg-white p-5 text-base font-bold shadow-sm"
            >
              Sorteios justos com links individuais e privados.
            </p>
            <p
              class="text-neutral rounded-2xl bg-white p-5 text-base font-bold shadow-sm"
            >
              Convites compartilháveis e painel de participantes.
            </p>
            <p
              class="text-neutral rounded-2xl bg-white p-5 text-base font-bold shadow-sm"
            >
              Experiência premium para amigo secreto ou inimigo.
            </p>
          </div>
        </div>
      </section>

      <section
        class="bg-neutral mt-20 rounded-[2.5rem] p-12 text-center text-white shadow-[0_24px_70px_rgba(26,26,46,0.18)]"
      >
        <h2 class="mx-auto max-w-3xl text-5xl leading-tight font-black">
          Pronto para começar a sua nova tradição?
        </h2>
        <div class="mt-9 flex justify-center gap-4">
          <a
            routerLink="/criar"
            class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 rounded-full px-8 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none"
            >Criar Grupo Agora</a
          >
          <button
            type="button"
            class="text-neutral hover:bg-primary-50 rounded-full bg-white px-8 py-4 text-base font-extrabold transition focus:ring-2 focus:ring-white focus:outline-none active:scale-[0.98]"
            (click)="requestContact()"
          >
            {{ contactLabel() }}
          </button>
        </div>
      </section>
    </app-desktop-layout>
  `,
})
export class HomePage {
  readonly contactLabel = signal<string>('Falar com Equipe');

  requestContact(): void {
    this.contactLabel.set('Equipe avisada ✓');
    setTimeout(() => this.contactLabel.set('Falar com Equipe'), 1800);
  }
}
