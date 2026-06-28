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
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppAvatarComponent } from '../../shared/components/app-avatar/app-avatar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { RevealService } from '../../core/services/reveal.service';
import { ApiErrorService } from '../../core/services/api-error.service';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { MyDrawResult } from '../../core/models';

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
        <app-avatar [initials]="(participant()?.name || 'US') | initials" />
      </header>

      <main class="flex-1 px-6 pb-8">
        @if (isLoading()) {
          <div
            class="flex flex-col items-center justify-center py-20 text-neutral-400"
          >
            <span
              class="loading loading-spinner loading-lg text-primary"
            ></span>
            <p class="mt-4 text-sm font-bold">Carregando revelação...</p>
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
          <section>
            <p
              class="text-primary text-[11px] font-black tracking-[0.2em] uppercase"
            >
              {{ 'Olá, ' + (participant()?.name || '') | uppercase }}
            </p>
            <h1
              class="text-neutral mt-3 text-[2.85rem] leading-none font-black"
            >
              A Grande Revelação
            </h1>
          </section>

          <section
            class="from-primary to-primary-800 shadow-brand-lg mt-7 rounded-[2.15rem] bg-linear-to-br p-6 text-white"
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
              @if (group()?.drawn_at) {
                Sua pessoa designada para a troca de presentes está pronta para
                ser descoberta.
              } @else {
                O organizador ainda não realizou o sorteio. Aguarde o sorteio
                para revelar seu amigo secreto!
              }
            </p>

            @if (countdownLabel()) {
              <div class="mt-7 text-center text-sm font-bold text-white/90">
                {{ countdownLabel() }}
              </div>
            } @else {
              <button
                type="button"
                [disabled]="!canReveal()"
                class="text-primary hover:bg-primary-50 mt-7 min-h-13 w-full rounded-full bg-white px-6 text-sm font-black shadow-[0_12px_28px_rgba(26,26,46,0.14)] transition focus:ring-2 focus:ring-white/80 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                (click)="reveal()"
              >
                {{ group()?.drawn_at ? revealLabel() : 'Aguardando Sorteio' }}
              </button>
            }
          </section>

          <div class="my-7 flex items-center gap-4">
            <span class="h-px flex-1 bg-neutral-100"></span>
            <p
              class="text-[10px] font-black tracking-[0.16em] text-neutral-300 uppercase"
            >
              Resultado
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
                [initials]="
                  isRevealed()
                    ? ((drawnParticipant()?.name || '') | initials)
                    : '🔒'
                "
                sizeClass="size-20 text-xl"
                [ariaLabel]="
                  'Avatar de ' +
                  (isRevealed() ? drawnParticipant()?.name || '' : '🔒')
                "
              />
            </div>
            <p
              class="text-primary mt-5 text-[11px] font-black tracking-[0.18em] uppercase"
            >
              Seu amigo secreto
            </p>
            <h2 class="text-neutral mt-2 text-2xl font-black">
              {{ isRevealed() ? drawnParticipant()?.name || '' : '••••••••' }}
            </h2>
          </section>

          <div class="mt-5 grid grid-cols-2 gap-4">
            <article
              class="rounded-[1.55rem] bg-white p-5 text-center shadow-[0_14px_35px_rgba(26,26,46,0.05)]"
            >
              <p class="text-neutral text-xl font-black">
                {{
                  group()?.drawn_at
                    ? (group()?.drawn_at | date: 'dd MMM')
                    : 'Pendente'
                }}
              </p>
              <p class="mt-1 text-xs font-bold text-neutral-400">
                Data do Sorteio
              </p>
            </article>
            <article
              class="rounded-[1.55rem] bg-white p-5 text-center shadow-[0_14px_35px_rgba(26,26,46,0.05)]"
            >
              <p class="text-neutral text-xl font-black">
                {{
                  group()?.price_limit
                    ? (group()?.price_limit | currency: 'BRL')
                    : 'Sem limite'
                }}
              </p>
              <p class="mt-1 text-xs font-bold text-neutral-400">
                Limite de Gasto
              </p>
            </article>
          </div>
        }
      </main>

      <app-bottom-nav active="reveal" />
    </app-mobile-shell>

    <app-desktop-layout>
      @if (isLoading()) {
        <div
          class="flex flex-col items-center justify-center py-20 text-neutral-400"
        >
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="mt-4 text-sm font-bold">Carregando revelação...</p>
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
        <section
          class="mx-auto flex min-h-[calc(100dvh-12rem)] max-w-3xl flex-col justify-center text-center"
        >
          <article
            class="rounded-[2.25rem] border border-[#ececf3] bg-white p-10 shadow-[0_24px_70px_rgba(26,26,46,0.075)]"
          >
            @if (isRevealed()) {
              <div
                class="bg-secondary-50 mx-auto grid size-20 place-items-center rounded-full text-4xl"
                aria-hidden="true"
              >
                🎉
              </div>
              <div class="mx-auto mt-5 flex justify-center">
                <app-avatar
                  [initials]="(drawnParticipant()?.name || '') | initials"
                  sizeClass="size-24 text-2xl"
                  [ariaLabel]="'Avatar de ' + (drawnParticipant()?.name || '')"
                />
              </div>
              <p
                class="text-primary mt-6 text-xs font-black tracking-[0.18em] uppercase"
              >
                Seu amigo secreto é
              </p>
              <h2 class="text-neutral mt-3 text-3xl font-black">
                {{ drawnParticipant()?.name }}
              </h2>
            } @else {
              <span
                class="bg-primary-50 mx-auto grid size-20 place-items-center rounded-full text-4xl"
                aria-hidden="true"
                >🔒</span
              >
              <p
                class="text-primary mt-7 text-xs font-black tracking-[0.18em] uppercase"
              >
                {{ 'Olá, ' + (participant()?.name || '') | uppercase }}
              </p>
              <h1 class="text-neutral mt-4 text-5xl leading-tight font-black">
                O grande momento chegou!
              </h1>
              <p
                class="mx-auto mt-5 max-w-xl text-base leading-7 font-medium text-neutral-400"
              >
                @if (group()?.drawn_at) {
                  Sua atribuição secreta está protegida e pronta para ser revelada
                  com privacidade.
                } @else {
                  Aguarde o sorteio pelo organizador para poder revelar seu amigo
                  secreto.
                }
              </p>
              @if (countdownLabel()) {
                <div class="mt-8 text-center text-base font-bold text-neutral-500">
                  {{ countdownLabel() }}
                </div>
              } @else {
                <button
                  type="button"
                  [disabled]="!canReveal()"
                  class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-8 rounded-full px-12 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  (click)="reveal()"
                >
                  {{ group()?.drawn_at ? revealLabel() : 'Aguardando Sorteio' }}
                </button>
              }
            }
          </article>

          <div class="mt-6 grid grid-cols-3 gap-5 text-left">
            <article
              class="rounded-2xl border border-[#ececf3] bg-white p-5 shadow-sm"
            >
              <p
                class="text-primary text-xs font-black tracking-[0.14em] uppercase"
              >
                Grupo
              </p>
              <p class="text-neutral mt-3 text-lg font-black">
                {{ group()?.name }}
              </p>
            </article>
            <article
              class="rounded-2xl border border-[#ececf3] bg-white p-5 shadow-sm"
            >
              <p
                class="text-primary text-xs font-black tracking-[0.14em] uppercase"
              >
                Orçamento
              </p>
              <p class="text-neutral mt-3 text-lg font-black">
                {{
                  group()?.price_limit
                    ? (group()?.price_limit | currency: 'BRL')
                    : 'Sem limite'
                }}
              </p>
            </article>
            <article
              class="rounded-2xl border border-[#ececf3] bg-white p-5 shadow-sm"
            >
              <p
                class="text-primary text-xs font-black tracking-[0.14em] uppercase"
              >
                Sorteio
              </p>
              <p class="text-neutral mt-3 text-lg font-black">
                {{
                  group()?.drawn_at
                    ? (group()?.drawn_at | date: 'dd MMM')
                    : 'Aguardando'
                }}
              </p>
            </article>
          </div>
        </section>
      }
    </app-desktop-layout>
  `,
})
export class RevealPage {
  readonly personalToken = input.required<string>();

  private readonly revealService = inject(RevealService);
  private readonly apiError = inject(ApiErrorService);

  readonly drawResource = resource<MyDrawResult | null, { token: string }>({
    params: () => ({ token: this.personalToken() }),
    loader: ({ params }) => this.revealService.getMyDraw(params.token),
  });

  readonly drawResult = computed<MyDrawResult | null>(() => this.drawResource.value() ?? null);
  readonly isLoading = computed<boolean>(() => this.drawResource.isLoading());
  readonly error = computed<string | null>(() => {
    if (this.drawResource.error()) return 'Erro ao carregar os dados. Tente novamente.';
    if (!this.drawResource.isLoading() && !this.drawResource.value()) {
      return 'Link de revelação inválido ou expirado.';
    }
    return null;
  });

  readonly isRevealed = signal<boolean>(false);
  readonly revealLabel = signal<string>('Revelar Resultado');

  // Computed signals para simplificar o template
  readonly participant = computed(() => this.drawResult()?.participant ?? null);
  readonly group = computed(() => this.drawResult()?.group ?? null);
  readonly drawnParticipant = computed(() => this.drawResult()?.drawn ?? null);

  readonly canReveal = computed(() => {
    const g = this.group();
    if (!g?.drawn_at) return false;
    if (!g.reveal_date) return true;
    return new Date() >= new Date(g.reveal_date);
  });

  readonly countdownLabel = computed(() => {
    const g = this.group();
    if (!g?.reveal_date) return null;
    const diff = new Date(g.reveal_date).getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.ceil(diff / 86_400_000);
    return `Revelação liberada em ${days} dia${days !== 1 ? 's' : ''}`;
  });

  constructor() {
    effect(() => {
      const result = this.drawResult();
      // Persiste o estado revelado: se já houve revelação (revealed_at gravado),
      // reabrir o link / dar F5 mantém o par visível.
      if (result?.participant?.revealed_at) {
        this.isRevealed.set(true);
      }
      // Guarda o token localmente para o atalho "Revelar" do menu inferior
      // funcionar para quem chega direto pelo link individual.
      const token = this.personalToken();
      if (result && token) {
        try {
          const stored = JSON.parse(
            localStorage.getItem('my_personal_tokens') ?? '[]',
          ) as string[];
          if (!stored.includes(token)) {
            stored.push(token);
            localStorage.setItem('my_personal_tokens', JSON.stringify(stored));
          }
        } catch {
          /* localStorage indisponível — ignorar */
        }
      }
    });
  }

  reveal(): void {
    if (!this.canReveal()) return;
    this.isRevealed.set(true);
    this.revealLabel.set('Resultado revelado ✓');
    // Registra o momento real da revelação (RPC sem efeito colateral na leitura).
    void this.revealService.markRevealed(this.personalToken());
  }
}
