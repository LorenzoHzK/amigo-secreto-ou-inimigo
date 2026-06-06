import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppAvatarComponent } from '../../shared/components/app-avatar/app-avatar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { InfoBadgeComponent } from '../../shared/components/info-badge/info-badge.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { ParticipantRowComponent } from '../../shared/components/participant-row/participant-row.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { GroupDemoService } from '../../core/services/group-demo.service';

interface ParticipantMock {
  name: string;
  initials: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    AppAvatarComponent,
    BottomNavComponent,
    InfoBadgeComponent,
    MobileShellComponent,
    ParticipantRowComponent,
    DesktopLayoutComponent,
    RouterLink,
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
        <p
          class="text-neutral max-w-[190px] truncate text-center text-sm font-black"
        >
          Natal da Família Silva
        </p>
        <app-avatar initials="AD" />
      </header>

      <main class="flex-1 space-y-5 px-6 pb-8">
        <section
          class="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
        >
          <app-info-badge [label]="'Grupo ativo' | uppercase" />
          <h1 class="text-neutral mt-5 text-[1.75rem] leading-tight font-black">
            Amigo Secreto 2024:
            <span class="block">Edição Curadoria Digital</span>
          </h1>
          <div class="mt-5 flex flex-wrap gap-2">
            <app-info-badge
              [label]="priceLimitLabel()"
              icon="💸"
              toneClass="border-primary-100 bg-primary-50 text-primary-700"
            />
            <app-info-badge
              [label]="revealDateLabel()"
              icon="📅"
              toneClass="border-accent-100 bg-accent-50 text-accent-800"
            />
          </div>
        </section>

        <section
          class="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
        >
          <h2 class="text-neutral text-xl font-black">
            Convidar Participantes
          </h2>
          <p class="mt-2 text-sm leading-6 font-medium text-neutral-400">
            Compartilhe o convite seguro com quem fará parte da troca.
          </p>
          <label class="mt-5 block">
            <span class="sr-only">Link de convite</span>
            <input
              type="text"
              readonly
              value="reveale.me/entrar/natal-silva"
              class="bg-base-200 w-full rounded-full border border-neutral-100 px-5 py-4 text-sm font-bold text-neutral-500 outline-none"
            />
          </label>
          <button
            type="button"
            class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 mt-4 min-h-12 w-full rounded-full text-sm font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
            (click)="copyInviteLink()"
          >
            {{ copyLabel() }}
          </button>
        </section>

        <section>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-neutral text-xl font-black">Participantes (5)</h2>
            <span
              class="text-primary rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
              >Pronto</span
            >
          </div>
          <div class="space-y-3">
            @for (participant of participants(); track participant.name) {
              <app-participant-row
                [name]="participant.name"
                [initials]="participant.initials"
              />
            }
          </div>
        </section>

        <button
          type="button"
          class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 min-h-14 w-full rounded-full px-8 text-base font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
          (click)="drawNames()"
        >
          {{ drawLabel() }}
        </button>
      </main>

      <app-bottom-nav active="admin" />
    </app-mobile-shell>

    <app-desktop-layout>
      <section class="grid grid-cols-[0.95fr_1.05fr] gap-8">
        <div class="space-y-6">
          <article
            class="rounded-[2rem] border border-[#ececf3] bg-white p-8 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
          >
            <app-info-badge [label]="'Grupo ativo' | uppercase" />
            <h1 class="text-neutral mt-6 text-4xl leading-tight font-black">
              Amigo Secreto 2024: Edição Curadoria Digital
            </h1>
            <div class="mt-6 flex gap-3">
              <app-info-badge [label]="priceLimitLabel()" />
              <app-info-badge
                [label]="revealDateLabel()"
                toneClass="border-accent-100 bg-accent-50 text-accent-800"
              />
            </div>
          </article>
          <article
            class="rounded-[2rem] border border-[#ececf3] bg-white p-8 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
          >
            <h2 class="text-neutral text-2xl font-black">
              Convidar Participantes
            </h2>
            <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">
              Copie o link seguro e envie para quem fará parte da troca.
            </p>
            <div class="mt-6 flex gap-3">
              <input
                type="text"
                readonly
                value="reveale.me/entrar/natal-silva"
                class="flex-1 rounded-full border border-[#ececf3] bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral-500 outline-none"
              />
              <button
                type="button"
                class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 rounded-full px-7 py-4 text-sm font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
                (click)="copyInviteLink()"
              >
                {{ copyLabel() }}
              </button>
            </div>
          </article>
          <button
            type="button"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 w-full rounded-full px-8 py-5 text-lg font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            (click)="drawNames()"
          >
            {{ drawLabel() }}
          </button>
        </div>
        <article
          class="rounded-[2rem] border border-[#ececf3] bg-white p-8 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-neutral text-3xl font-black">Participantes</h2>
            <span
              class="bg-primary-50 text-primary rounded-full px-4 py-2 text-sm font-black"
              >5 confirmados</span
            >
          </div>
          <div class="mt-7 space-y-4">
            @for (participant of participants(); track participant.name) {
              <app-participant-row
                [name]="participant.name"
                [initials]="participant.initials"
              />
            }
          </div>
        </article>
      </section>
    </app-desktop-layout>
  `,
})
export class AdminPage {
  readonly adminToken = input.required<string>();
  readonly demoService = inject(GroupDemoService);

  readonly copyLabel = signal<string>('Copiar Link');
  readonly drawLabel = signal<string>('🎉 Sortear Nomes');

  readonly participants = signal<ParticipantMock[]>([
    { name: 'Alex Rivera', initials: 'AR' },
    { name: 'Marcus Chen', initials: 'MC' },
    { name: 'Sarah Jenkins', initials: 'SJ' },
    { name: 'David Thorne', initials: 'DT' },
    { name: 'Leo Rodriguez', initials: 'LR' },
  ]);

  constructor() {
    effect(() => {
      localStorage.setItem('last-admin-token', this.adminToken());
    });
    void this.demoService.loadGroups();
  }

  priceLimitLabel(): string {
    const priceLimit = this.demoService.selectedGroup()?.priceLimit ?? 50;
    return `Limite: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceLimit)}`;
  }

  revealDateLabel(): string {
    const revealDate =
      this.demoService.selectedGroup()?.revealDate ?? '2024-12-24';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(revealDate));
  }

  copyInviteLink(): void {
    this.copyLabel.set('Link copiado ✓');
    setTimeout(() => this.copyLabel.set('Copiar Link'), 1800);
  }

  drawNames(): void {
    this.drawLabel.set('Sorteio realizado ✓');
  }
}
