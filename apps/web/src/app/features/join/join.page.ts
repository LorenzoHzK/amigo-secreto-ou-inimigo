import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GroupPublicView, ParticipantPublicView } from '../../core/models';
import { GroupService } from '../../core/services/group.service';
import { ParticipantService } from '../../core/services/participant.service';

@Component({
  selector: 'app-join-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex min-h-dvh max-w-2xl items-center px-5 py-10">
      @if (isLoading()) {
        <div class="w-full rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="mt-4 text-sm font-bold text-neutral-400">Carregando convite...</p>
        </div>
      } @else if (error()) {
        <div class="w-full rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]">
          <p class="text-error text-sm font-bold">{{ error() }}</p>
          <a routerLink="/" class="btn btn-primary mt-4 rounded-full">Voltar ao início</a>
        </div>
      } @else {
        <div class="grid w-full gap-6 lg:grid-cols-2">
          <article class="rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(108,59,255,0.14)]">
            <p class="text-primary text-xs font-black tracking-[0.2em] uppercase">Você foi convidado</p>
            <h1 class="text-neutral mt-4 text-4xl leading-tight font-black">{{ group()?.name }}</h1>
            <p class="mt-4 text-sm leading-6 font-medium text-neutral-400">
              Selecione o seu nome na lista do organizador e confirme a senha do grupo para entrar.
            </p>
            <div class="mt-6 rounded-[1.5rem] bg-primary-50 p-4 text-sm font-bold text-primary-700">
              {{ priceLimitLabel() }}
            </div>
          </article>

          <form class="rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_24px_70px_rgba(26,26,46,0.08)]" [formGroup]="form" (ngSubmit)="joinGroup()">
            <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Entrar</p>
            <h2 class="text-neutral mt-4 text-3xl leading-tight font-black">Confirme sua entrada</h2>

            @if (unclaimed().length === 0) {
              <p class="mt-6 rounded-[1.25rem] bg-[#f8f8fb] p-4 text-sm font-bold text-neutral-500">
                Não há nomes disponíveis para entrar. Todos já entraram ou o
                organizador ainda não adicionou você. Fale com quem criou o grupo.
              </p>
            } @else {
              <label class="mt-6 block">
                <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Seu nome</span>
                <select
                  formControlName="participantId"
                  class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                >
                  <option value="" disabled>Selecione seu nome</option>
                  @for (p of unclaimed(); track p.id) {
                    <option [value]="p.id">{{ p.name }}</option>
                  }
                </select>
                @if (form.controls.participantId.touched && form.controls.participantId.invalid) {
                  <p class="mt-2 text-xs font-bold text-error">Selecione seu nome para continuar.</p>
                }
              </label>

              @if (group()?.has_join_password) {
                <label class="mt-5 block">
                  <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Senha do grupo</span>
                  <input
                    type="password"
                    formControlName="password"
                    autocomplete="off"
                    class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                    placeholder="Senha informada pelo organizador"
                  />
                  @if (form.controls.password.touched && form.controls.password.invalid) {
                    <p class="mt-2 text-xs font-bold text-error">Informe a senha do grupo.</p>
                  }
                </label>
              }

              <button
                type="submit"
                [disabled]="form.invalid || isSubmitting()"
                class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-7 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ buttonLabel() }}
              </button>

              @if (formError()) {
                <p class="mt-4 text-center text-sm font-bold text-error">{{ formError() }}</p>
              }
            }
          </form>
        </div>
      }
    </section>
  `,
})
export class JoinPage {
  readonly inviteToken = input.required<string>();

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);

  readonly group = signal<GroupPublicView | null>(null);
  readonly unclaimed = signal<ParticipantPublicView[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly buttonLabel = signal('Entrar no grupo');

  readonly form = this.fb.nonNullable.group({
    participantId: ['', [Validators.required]],
    password: [''],
  });

  // A senha só é obrigatória se o grupo exigir senha.
  private readonly passwordRequired = computed(
    () => this.group()?.has_join_password === true,
  );

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
      const group = await this.groupService.getPublicGroupByInviteToken(token);
      if (!group) {
        this.error.set('Link de convite inválido ou expirado.');
        return;
      }
      if (group.status === 'drawn' || group.drawn_at !== null) {
        this.error.set('Este grupo já realizou o sorteio. Não é possível entrar agora.');
        return;
      }

      this.group.set(group);

      const participants = await this.participantService.getParticipantsByGroupId(
        group.id,
      );
      this.unclaimed.set(participants.filter((p) => p.claimed_at === null));

      if (this.passwordRequired()) {
        this.form.controls.password.addValidators(Validators.required);
        this.form.controls.password.updateValueAndValidity();
      }
    } catch (error) {
      console.error(error);
      this.error.set('Erro ao carregar o grupo. Tente novamente.');
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
    this.formError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const group = this.group();
    if (!group) {
      return;
    }

    const participantId = this.form.controls.participantId.value;
    const password = this.form.controls.password.value;

    this.isSubmitting.set(true);
    this.buttonLabel.set('Confirmando...');

    try {
      const result = await this.participantService.claimParticipant(
        this.inviteToken(),
        password,
        participantId,
      );

      if (result.status === 'ok' && result.personal_token) {
        const token = result.personal_token;
        const stored = this.readTokenList('my_personal_tokens');
        if (!stored.includes(token)) {
          stored.push(token);
          localStorage.setItem('my_personal_tokens', JSON.stringify(stored));
        }
        this.buttonLabel.set('Entrada confirmada ✓');
        setTimeout(() => void this.router.navigateByUrl(`/revelar/${token}`), 400);
        return;
      }

      this.buttonLabel.set('Entrar no grupo');
      this.formError.set(this.messageFor(result.status));

      // Se o nome já foi reivindicado, remove-o da lista local.
      if (result.status === 'already_claimed') {
        this.unclaimed.update((list) =>
          list.filter((p) => p.id !== participantId),
        );
        this.form.controls.participantId.setValue('');
      }
    } catch (error) {
      console.error(error);
      this.buttonLabel.set('Entrar no grupo');
      this.formError.set('Erro ao entrar. Tente novamente.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private messageFor(status: string): string {
    switch (status) {
      case 'wrong_password':
        return 'Senha do grupo incorreta.';
      case 'already_claimed':
        return 'Esse nome já foi reivindicado. Selecione outro ou fale com o organizador.';
      case 'not_found':
        return 'Nome não encontrado na lista. Peça ao organizador para adicionar você.';
      case 'group_unavailable':
        return 'Este grupo não está disponível para entrada.';
      default:
        return 'Não foi possível entrar. Tente novamente.';
    }
  }

  private readTokenList(key: string): string[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]') as string[];
    } catch {
      return [];
    }
  }
}
