import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  resource,
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
import { ApiErrorService } from '../../core/services/api-error.service';
import { AuthService } from '../../core/services/auth.service';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { Group, ParticipantLink } from '../../core/models';

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
    InitialsPipe,
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
        <app-avatar [initials]="organizerInitials() | initials" />
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
            <h2 class="text-neutral text-xl font-black">Links individuais</h2>
            <p class="mt-2 text-sm leading-6 font-medium text-neutral-400">
              Cada participante tem um link privado para ver o seu par. Envie a
              cada pessoa o link dela — funciona antes e depois do sorteio.
            </p>
            @if (participants().length === 0) {
              <p class="mt-4 text-sm text-neutral-400">
                Adicione participantes abaixo para gerar os links.
              </p>
            } @else {
              <div class="mt-4 space-y-2">
                @for (p of participants(); track p.id) {
                  <div class="bg-base-200 flex items-center gap-2 rounded-[1.25rem] px-4 py-3">
                    <span class="text-neutral min-w-0 flex-1 truncate text-sm font-extrabold">{{ p.name }}</span>
                    <button
                      type="button"
                      class="text-primary border-primary-200 hover:bg-primary-50 shrink-0 rounded-full border px-4 py-2 text-xs font-extrabold transition active:scale-[0.98]"
                      (click)="copyLink(p)"
                    >
                      {{ copiedToken() === p.personal_token ? 'Copiado ✓' : 'Copiar link' }}
                    </button>
                  </div>
                }
              </div>
              <button
                type="button"
                class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 mt-4 min-h-12 w-full rounded-full text-sm font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
                (click)="copyAllLinks()"
              >
                {{ copyLabel() }}
              </button>
            }
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
                  [initials]="participant.name | initials"
                  [showRemove]="!isDrawn() && isOwner()"
                  (remove)="deleteParticipant(participant.id, participant.name)"
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
            [disabled]="participants().length < 3 || isDrawn()"
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
              <h2 class="text-neutral text-2xl font-black">Links individuais</h2>
              <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">
                Cada participante tem um link privado para ver o seu par. Envie a
                cada pessoa o link dela — funciona antes e depois do sorteio.
              </p>
              @if (participants().length === 0) {
                <p class="mt-4 text-sm text-neutral-400">
                  Adicione participantes ao lado para gerar os links.
                </p>
              } @else {
                <div class="mt-6 space-y-2">
                  @for (p of participants(); track p.id) {
                    <div class="flex items-center gap-3 rounded-full border border-[#ececf3] bg-[#f8f8fb] px-5 py-3">
                      <span class="text-neutral min-w-0 flex-1 truncate text-sm font-extrabold">{{ p.name }}</span>
                      <button
                        type="button"
                        class="text-primary border-primary-200 hover:bg-primary-50 shrink-0 rounded-full border px-5 py-2 text-xs font-extrabold transition active:scale-[0.98]"
                        (click)="copyLink(p)"
                      >
                        {{ copiedToken() === p.personal_token ? 'Copiado ✓' : 'Copiar link' }}
                      </button>
                    </div>
                  }
                </div>
                <button
                  type="button"
                  class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 mt-5 w-full rounded-full px-7 py-4 text-sm font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
                  (click)="copyAllLinks()"
                >
                  {{ copyLabel() }}
                </button>
              }
            </article>
            <button
              type="button"
              [disabled]="participants().length < 3 || isDrawn()"
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
                  [initials]="participant.name | initials"
                  [showRemove]="!isDrawn() && isOwner()"
                  (remove)="deleteParticipant(participant.id, participant.name)"
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
  private readonly apiError = inject(ApiErrorService);
  readonly auth = inject(AuthService);

  readonly organizerInitials = computed(() => {
    const name = this.auth.user()?.user_metadata?.['display_name'] as string | undefined
      ?? this.auth.user()?.email
      ?? 'AD';
    return name;
  });

  // Resource do grupo — reativa ao adminToken
  readonly groupResource = resource<Group | null, { token: string }>({
    params: () => ({ token: this.adminToken() }),
    loader: ({ params }) => this.groupService.getGroupByAdminToken(params.token),
  });

  // Resource dos participantes com os links individuais — reativa ao admin_token.
  readonly linksResource = resource<ParticipantLink[], { token: string }>({
    params: () => ({ token: this.adminToken() }),
    loader: ({ params }) => this.groupService.getParticipantLinks(params.token),
  });

  // Aliases para o template
  readonly group = computed<Group | null>(() => this.groupResource.value() ?? null);
  readonly participants = computed<ParticipantLink[]>(
    () => this.linksResource.value() ?? [],
  );
  readonly isLoading = computed(
    () => this.groupResource.isLoading() || this.linksResource.isLoading(),
  );
  readonly error = computed(() => {
    if (this.groupResource.error() || this.linksResource.error()) {
      return 'Falha ao carregar dados do grupo.';
    }
    if (!this.groupResource.isLoading() && this.groupResource.value() === null) {
      return 'Grupo não encontrado com o token fornecido.';
    }
    return null;
  });

  readonly isDrawn = computed(() => this.group()?.drawn_at !== null);

  // Só o dono autenticado do grupo pode remover participantes (a RPC
  // remove_participant exige auth.uid() = owner_id). Logo, o botão de
  // excluir só deve aparecer para ele.
  readonly isOwner = computed(() => {
    const ownerId = this.group()?.owner_id;
    return !!ownerId && this.auth.user()?.id === ownerId;
  });

  readonly copyLabel = signal<string>('Copiar todos os links');
  readonly drawLabel = signal<string>('🎉 Sortear Nomes');
  readonly copiedToken = signal<string | null>(null);

  readonly priceLimitLabel = computed(() => {
    const priceLimit = this.group()?.price_limit;
    if (priceLimit === undefined || priceLimit === null) {
      return 'Sem limite de preço';
    }
    return `Limite: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceLimit)}`;
  });

  readonly revealDateLabel = computed(() => {
    const drawnAt = this.group()?.drawn_at;
    if (drawnAt) {
      return `Sorteado em: ${new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(drawnAt))}`;
    }
    return 'Aguardando Sorteio';
  });

  constructor() {
    effect(() => {
      const token = this.adminToken();
      if (token) {
        localStorage.setItem('last-admin-token', token);
      }
    });
  }

  revealLink(token: string): string {
    return `${window.location.origin}/revelar/${token}`;
  }

  copyLink(p: ParticipantLink): void {
    navigator.clipboard.writeText(this.revealLink(p.personal_token)).then(() => {
      this.copiedToken.set(p.personal_token);
      setTimeout(() => this.copiedToken.set(null), 1800);
    });
  }

  copyAllLinks(): void {
    const text = this.participants()
      .map((p) => `${p.name}: ${this.revealLink(p.personal_token)}`)
      .join('\n');
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copyLabel.set('Todos copiados ✓');
      setTimeout(() => this.copyLabel.set('Copiar todos os links'), 1800);
    });
  }

  async addParticipant(name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) return;
    const g = this.group();
    if (!g || this.isDrawn()) return;

    const duplicate = this.participants().some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      this.apiError.report(`"${trimmed}" já está na lista de participantes.`);
      return;
    }

    try {
      await this.participantService.addParticipant(g.id, trimmed);
      this.linksResource.reload();
    } catch (err) {
      console.error(err);
      this.apiError.report('Erro ao adicionar participante. Tente novamente.');
    }
  }

  async deleteParticipant(id: string, name: string): Promise<void> {
    if (this.isDrawn() || !this.isOwner()) {
      return;
    }

    const confirmed = window.confirm(
      `Remover "${name}" do grupo? Esta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    try {
      const removed = await this.participantService.removeParticipant(id);
      if (!removed) {
        this.apiError.report(
          'Não foi possível remover. Apenas o organizador (logado) pode remover, e somente antes do sorteio.',
        );
      }
      this.linksResource.reload();
    } catch (err) {
      console.error(err);
      this.apiError.report('Erro ao remover participante. Tente novamente.');
    }
  }

  async drawNames(): Promise<void> {
    const g = this.group();
    if (!g || this.isDrawn()) return;

    this.drawLabel.set('Sorteando...');
    try {
      await this.drawService.draw(this.adminToken());
      this.drawLabel.set('Sorteio realizado ✓');
      this.groupResource.reload();
      this.linksResource.reload();
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : 'Erro ao realizar o sorteio.';
      this.apiError.report(msg);
      this.drawLabel.set('🎉 Sortear Nomes');
    }
  }
}
