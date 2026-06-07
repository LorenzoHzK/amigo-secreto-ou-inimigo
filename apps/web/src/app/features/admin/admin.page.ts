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
import { GroupService } from '../../core/services/group.service';
import { ParticipantService } from '../../core/services/participant.service';
import { DrawService } from '../../core/services/draw.service';
import { Group, Participant } from '../../core/models';

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
          {{ group()?.name || 'Carregando...' }}
        </p>
        <app-avatar initials="AD" />
      </header>

      <main class="flex-1 space-y-5 px-6 pb-8">
        @if (isLoading()) {
          <div
            class="flex flex-col items-center justify-center py-20 text-neutral-400"
          >
            <span
              class="loading loading-spinner loading-lg text-primary"
            ></span>
            <p class="mt-4 text-sm font-bold">Carregando painel...</p>
          </div>
        } @else if (error()) {
          <div
            class="rounded-[2rem] bg-white p-6 text-center shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
          >
            <p class="text-error text-sm font-bold">{{ error() }}</p>
            <a routerLink="/" class="btn btn-primary mt-4 rounded-full"
              >Voltar ao início</a
            >
          </div>
        } @else {
          <section
            class="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
          >
            <app-info-badge
              [label]="(group()?.drawn_at ? 'Sorteado' : 'Aberto') | uppercase"
            />
            <h1
              class="text-neutral mt-5 text-[1.75rem] leading-tight font-black"
            >
              {{ group()?.name }}
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
                [value]="getInviteLink()"
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
              <h2 class="text-neutral text-xl font-black">
                Participantes ({{ participants().length }})
              </h2>
              <span
                class="text-primary rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
                >{{ participants().length >= 3 ? 'Pronto' : 'Mínimo 3' }}</span
              >
            </div>

            <div
              class="mb-4 flex gap-2 rounded-[1.25rem] bg-white p-3 shadow-inner"
            >
              <input
                type="text"
                placeholder="Adicionar participante..."
                #newParticipantNameMobile
                class="text-neutral flex-1 bg-transparent px-3 text-sm font-bold outline-none"
                (keyup.enter)="
                  addParticipant(newParticipantNameMobile.value);
                  newParticipantNameMobile.value = ''
                "
              />
              <button
                type="button"
                class="bg-primary hover:bg-primary-700 grid size-9 place-items-center rounded-full text-white transition active:scale-95"
                (click)="
                  addParticipant(newParticipantNameMobile.value);
                  newParticipantNameMobile.value = ''
                "
              >
                +
              </button>
            </div>

            <div class="space-y-3">
              @for (participant of participants(); track participant.id) {
                <app-participant-row
                  [name]="participant.name"
                  [initials]="getInitials(participant.name)"
                  (remove)="deleteParticipant(participant.id)"
                />
              } @empty {
                <p class="py-4 text-center text-sm text-neutral-400">
                  Nenhum participante adicionado ainda.
                </p>
              }
            </div>
          </section>

          <button
            type="button"
            [disabled]="participants().length < 3"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 min-h-14 w-full rounded-full px-8 text-base font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            (click)="drawNames()"
          >
            {{ group()?.drawn_at ? 'Sorteio Realizado ✓' : drawLabel() }}
          </button>
        }
      </main>

      <app-bottom-nav active="admin" />
    </app-mobile-shell>

    <app-desktop-layout>
      @if (isLoading()) {
        <div
          class="flex flex-col items-center justify-center py-20 text-neutral-400"
        >
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="mt-4 text-sm font-bold">Carregando painel...</p>
        </div>
      } @else if (error()) {
        <div
          class="mx-auto max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
        >
          <p class="text-error text-base font-bold">{{ error() }}</p>
          <a routerLink="/" class="btn btn-primary mt-4 rounded-full"
            >Voltar ao início</a
          >
        </div>
      } @else {
        <section class="grid grid-cols-[0.95fr_1.05fr] gap-8">
          <div class="space-y-6">
            <article
              class="rounded-[2rem] border border-[#ececf3] bg-white p-8 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
            >
              <app-info-badge
                [label]="
                  (group()?.drawn_at ? 'Sorteado' : 'Aberto') | uppercase
                "
              />
              <h1 class="text-neutral mt-6 text-4xl leading-tight font-black">
                {{ group()?.name }}
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
                  [value]="getInviteLink()"
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
              [disabled]="participants().length < 3"
              class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 w-full rounded-full px-8 py-5 text-lg font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              (click)="drawNames()"
            >
              {{ group()?.drawn_at ? 'Sorteio Realizado ✓' : drawLabel() }}
            </button>
          </div>
          <article
            class="rounded-[2rem] border border-[#ececf3] bg-white p-8 shadow-[0_18px_45px_rgba(26,26,46,0.06)]"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-neutral text-3xl font-black">Participantes</h2>
              <span
                class="bg-primary-50 text-primary rounded-full px-4 py-2 text-sm font-black"
                >{{ participants().length }} confirmados</span
              >
            </div>

            <div
              class="mt-7 mb-4 flex gap-2 rounded-[1.25rem] bg-neutral-50 p-3 shadow-inner"
            >
              <input
                type="text"
                placeholder="Adicionar participante..."
                #newParticipantNameDesktop
                class="text-neutral flex-1 bg-transparent px-3 text-sm font-bold outline-none"
                (keyup.enter)="
                  addParticipant(newParticipantNameDesktop.value);
                  newParticipantNameDesktop.value = ''
                "
              />
              <button
                type="button"
                class="bg-primary hover:bg-primary-700 grid size-9 place-items-center rounded-full text-white transition active:scale-95"
                (click)="
                  addParticipant(newParticipantNameDesktop.value);
                  newParticipantNameDesktop.value = ''
                "
              >
                +
              </button>
            </div>

            <div class="mt-4 space-y-4">
              @for (participant of participants(); track participant.id) {
                <app-participant-row
                  [name]="participant.name"
                  [initials]="getInitials(participant.name)"
                  (remove)="deleteParticipant(participant.id)"
                />
              } @empty {
                <p class="py-8 text-center text-sm text-neutral-400">
                  Nenhum participante adicionado ainda.
                </p>
              }
            </div>
          </article>
        </section>
      }
    </app-desktop-layout>
  `,
})
export class AdminPage {
  readonly adminToken = input.required<string>();

  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);
  private readonly drawService = inject(DrawService);

  readonly group = signal<Group | null>(null);
  readonly participants = signal<Participant[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly copyLabel = signal<string>('Copiar Link');
  readonly drawLabel = signal<string>('🎉 Sortear Nomes');

  constructor() {
    effect(() => {
      const token = this.adminToken();
      if (token) {
        localStorage.setItem('last-admin-token', token);
        void this.loadData(token);
      }
    });
  }

  async loadData(token: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const g = await this.groupService.getGroupByAdminToken(token);
      if (!g) {
        this.error.set('Grupo não encontrado com o token fornecido.');
        this.group.set(null);
        this.participants.set([]);
        return;
      }
      this.group.set(g);
      const list = await this.participantService.getParticipantsByGroupId(g.id);
      this.participants.set(list);
    } catch (err) {
      console.error(err);
      this.error.set('Falha ao carregar dados do grupo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  priceLimitLabel(): string {
    const priceLimit = this.group()?.price_limit;
    if (priceLimit === undefined || priceLimit === null) {
      return 'Sem limite de preço';
    }
    return `Limite: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceLimit)}`;
  }

  revealDateLabel(): string {
    const drawnAt = this.group()?.drawn_at;
    if (drawnAt) {
      return `Sorteado em: ${new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(drawnAt))}`;
    }
    return 'Aguardando Sorteio';
  }

  getInviteLink(): string {
    const g = this.group();
    if (!g) return '';
    return `${window.location.origin}/entrar/${g.invite_token}`;
  }

  copyInviteLink(): void {
    const link = this.getInviteLink();
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      this.copyLabel.set('Link copiado ✓');
      setTimeout(() => this.copyLabel.set('Copiar Link'), 1800);
    });
  }

  async addParticipant(name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) return;
    const g = this.group();
    if (!g) return;

    try {
      const newP = await this.participantService.addParticipant(g.id, trimmed);
      this.participants.update((prev) => [...prev, newP]);
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar participante.');
    }
  }

  async deleteParticipant(id: string): Promise<void> {
    try {
      await this.participantService.removeParticipant(id);
      this.participants.update((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao remover participante.');
    }
  }

  async drawNames(): Promise<void> {
    const g = this.group();
    if (!g) return;

    this.drawLabel.set('Sorteando...');
    try {
      await this.drawService.draw(g.id);
      this.drawLabel.set('Sorteio realizado ✓');
      await this.loadData(this.adminToken());
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : 'Erro ao realizar o sorteio.';
      alert(msg);
      this.drawLabel.set('🎉 Sortear Nomes');
    }
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
