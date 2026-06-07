import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { InfoBadgeComponent } from '../../shared/components/info-badge/info-badge.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { GroupService } from '../../core/services/group.service';
import { ParticipantService } from '../../core/services/participant.service';
import { Group } from '../../core/models';

@Component({
  selector: 'app-join-page',
  standalone: true,
  imports: [
    InfoBadgeComponent,
    MobileShellComponent,
    DesktopLayoutComponent,
    TextFieldComponent,
    UpperCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-shell outerClass="bg-primary-50" innerClass="bg-primary-50">
      <main class="flex min-h-dvh flex-1 flex-col justify-center px-6 py-8">
        @if (isLoading()) {
          <div
            class="rounded-[2.25rem] bg-white px-6 py-12 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]"
          >
            <span
              class="loading loading-spinner loading-lg text-primary"
            ></span>
            <p class="mt-4 text-sm font-bold text-neutral-400">
              Carregando convite...
            </p>
          </div>
        } @else if (error()) {
          <div
            class="rounded-[2.25rem] bg-white px-6 py-8 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]"
          >
            <p class="text-error text-sm font-bold">{{ error() }}</p>
            <a routerLink="/" class="btn btn-primary mt-4 rounded-full"
              >Voltar ao início</a
            >
          </div>
        } @else {
          <section
            class="rounded-[2.25rem] bg-white px-6 py-8 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]"
          >
            <p
              class="text-neutral text-xs font-black tracking-[0.2em] uppercase"
            >
              {{ 'Amigo Secreto' | uppercase }}
            </p>
            <p class="text-primary mt-1 text-xs font-black">ou Inimigo</p>

            <div
              class="bg-primary-50 mx-auto mt-7 grid size-20 place-items-center rounded-full text-4xl shadow-inner"
              aria-hidden="true"
            >
              🎉
            </div>

            <p
              class="text-primary mt-7 text-[11px] font-black tracking-[0.18em] uppercase"
            >
              Você foi convidado
            </p>
            <h1 class="text-neutral mt-3 text-[2rem] leading-tight font-black">
              {{ group()?.name }}
            </h1>

            <div class="mt-5">
              <app-info-badge
                [label]="priceLimitLabel()"
                toneClass="border-primary-100 bg-primary-50 text-primary-700"
              />
            </div>

            <app-text-field
              label="Como devemos te chamar?"
              placeholder="Seu nome completo"
              autocomplete="name"
              hostClass="mt-8 text-left"
              [(value)]="participantName"
              (committed)="lastCommittedName.set($event)"
            />

            <p
              class="mt-4 text-left text-sm leading-6 font-medium text-neutral-400"
            >
              Depois de entrar, você poderá acompanhar a revelação e preparar
              sua lista de desejos com privacidade.
            </p>

            <button
              type="button"
              class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-7 min-h-14 w-full rounded-full px-8 text-base font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
              (click)="joinGroup()"
            >
              {{ joinLabel() }}
            </button>
          </section>

          <p class="mt-6 text-center text-xs font-black text-neutral-400">
            Acesso Seguro & Privado
          </p>

          <div class="mt-5 grid grid-cols-2 gap-4">
            <article
              class="rounded-2xl bg-white/80 p-4 text-center shadow-[0_14px_35px_rgba(108,59,255,0.08)]"
            >
              <p class="text-neutral text-2xl font-black">
                {{ participantsCount() }}
              </p>
              <p class="mt-1 text-xs leading-4 font-bold text-neutral-400">
                Pessoas já entraram
              </p>
            </article>
            <article
              class="rounded-2xl bg-white/80 p-4 text-center shadow-[0_14px_35px_rgba(108,59,255,0.08)]"
            >
              <p class="text-neutral truncate text-lg font-black">
                {{ group()?.drawn_at ? 'Sorteado!' : 'Aberto' }}
              </p>
              <p class="mt-1 text-xs leading-4 font-bold text-neutral-400">
                Status do grupo
              </p>
            </article>
          </div>
        }
      </main>
    </app-mobile-shell>

    <app-desktop-layout className="bg-primary-50/45">
      @if (isLoading()) {
        <div
          class="flex flex-col items-center justify-center py-20 text-neutral-400"
        >
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="mt-4 text-sm font-bold">Carregando convite...</p>
        </div>
      } @else if (error()) {
        <div
          class="mx-auto max-w-md rounded-[2.25rem] bg-white p-10 text-center shadow-lg"
        >
          <p class="text-error text-base font-bold">{{ error() }}</p>
          <a routerLink="/" class="btn btn-primary mt-4 rounded-full"
            >Voltar ao início</a
          >
        </div>
      } @else {
        <section class="relative mx-auto grid max-w-5xl grid-cols-2 gap-8">
          <div
            class="bg-primary-200/40 absolute inset-20 -z-10 rounded-full blur-3xl"
          ></div>
          <article
            class="border-primary-100 rounded-[2.5rem] border bg-white/85 p-10 shadow-[0_24px_70px_rgba(108,59,255,0.12)] backdrop-blur"
          >
            <p
              class="text-primary text-xs font-black tracking-[0.2em] uppercase"
            >
              Você foi convidado
            </p>
            <h1 class="text-neutral mt-5 text-5xl leading-tight font-black">
              {{ group()?.name }}
            </h1>
            <div class="mt-6">
              <app-info-badge [label]="priceLimitLabel()" />
            </div>
            <p class="mt-7 text-base leading-7 font-medium text-neutral-400">
              Entre no grupo para participar da curadoria, acompanhar a data de
              revelação e preparar sua lista de desejos.
            </p>
            <div class="mt-10 grid grid-cols-2 gap-4">
              <div class="bg-primary-50 rounded-2xl p-5">
                <p class="text-neutral text-3xl font-black">
                  {{ participantsCount() }}
                </p>
                <p class="mt-1 text-sm font-bold text-neutral-400">
                  Pessoas já entraram
                </p>
              </div>
              <div class="bg-accent-50 rounded-2xl p-5">
                <p class="text-neutral truncate text-xl font-black">
                  {{ group()?.drawn_at ? 'Sorteado!' : 'Aberto' }}
                </p>
                <p class="mt-1 text-sm font-bold text-neutral-400">
                  Status do grupo
                </p>
              </div>
            </div>
          </article>
          <form
            class="rounded-[2.5rem] border border-[#ececf3] bg-white p-10 shadow-[0_24px_70px_rgba(26,26,46,0.08)]"
            aria-label="Entrar no grupo desktop"
          >
            <span
              class="bg-primary-50 mx-auto grid size-20 place-items-center rounded-full text-4xl"
              aria-hidden="true"
              >🎉</span
            >
            <h2 class="text-neutral mt-7 text-center text-4xl font-black">
              Confirme sua entrada
            </h2>
            <app-text-field
              label="Como devemos te chamar?"
              placeholder="Seu nome completo"
              autocomplete="name"
              hostClass="mt-8"
              [(value)]="participantName"
              (committed)="lastCommittedName.set($event)"
            />
            <p class="mt-4 text-sm leading-6 font-medium text-neutral-400">
              Seu acesso é seguro e privado. Você verá apenas sua própria
              revelação.
            </p>
            <button
              type="button"
              class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-7 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
              (click)="joinGroup()"
            >
              {{ joinLabel() }}
            </button>
          </form>
        </section>
      }
    </app-desktop-layout>
  `,
})
export class JoinPage {
  readonly inviteToken = input.required<string>();
  private readonly router = inject(Router);

  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);

  readonly group = signal<Group | null>(null);
  readonly participantsCount = signal<number>(0);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly joinLabel = signal<string>('Entrar no grupo →');
  readonly participantName = model<string>('');
  readonly lastCommittedName = signal<string>('');

  constructor() {
    effect(() => {
      const token = this.inviteToken();
      if (token) {
        void this.loadGroup(token);
      }
    });
  }

  async loadGroup(token: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const g = await this.groupService.getGroupByInviteToken(token);
      if (!g) {
        this.error.set('Link de convite inválido ou expirado.');
        return;
      }
      this.group.set(g);
      const list = await this.participantService.getParticipantsByGroupId(g.id);
      this.participantsCount.set(list.length);
    } catch (err) {
      console.error(err);
      this.error.set('Erro ao carregar o grupo.');
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

  async joinGroup(): Promise<void> {
    const name = this.participantName().trim();
    if (!name) {
      alert('Por favor, informe seu nome.');
      return;
    }
    const g = this.group();
    if (!g) return;

    this.joinLabel.set('Confirmando...');
    try {
      const p = await this.participantService.addParticipant(g.id, name);

      let storedPersonal: string[] = [];
      try {
        storedPersonal = JSON.parse(
          localStorage.getItem('my_personal_tokens') || '[]',
        );
      } catch {
        storedPersonal = [];
      }
      if (!storedPersonal.includes(p.personal_token)) {
        storedPersonal.push(p.personal_token);
        localStorage.setItem(
          'my_personal_tokens',
          JSON.stringify(storedPersonal),
        );
      }

      this.joinLabel.set('Entrada confirmada ✓');
      setTimeout(
        () => void this.router.navigateByUrl(`/revelar/${p.personal_token}`),
        450,
      );
    } catch (err) {
      console.error(err);
      this.joinLabel.set('Erro ao entrar ❌');
      setTimeout(() => this.joinLabel.set('Entrar no grupo →'), 2000);
    }
  }
}
