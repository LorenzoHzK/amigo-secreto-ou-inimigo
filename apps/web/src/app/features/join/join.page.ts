import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Group } from '../../core/models';
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
              Entre com seu nome para participar da troca. O Supabase grava os participantes e o link privado.
            </p>
            <div class="mt-6 rounded-[1.5rem] bg-primary-50 p-4 text-sm font-bold text-primary-700">
              {{ priceLimitLabel() }}
            </div>
          </article>

          <form class="rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_24px_70px_rgba(26,26,46,0.08)]" [formGroup]="form" (ngSubmit)="joinGroup()">
            <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Entrar</p>
            <h2 class="text-neutral mt-4 text-3xl leading-tight font-black">Confirme sua entrada</h2>

            <label class="mt-6 block">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Seu nome</span>
              <input
                type="text"
                formControlName="participantName"
                autocomplete="name"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                placeholder="Seu nome completo"
              />
              @if (form.controls.participantName.touched && form.controls.participantName.invalid) {
                <p class="mt-2 text-xs font-bold text-error">Informe seu nome para continuar.</p>
              }
            </label>

            <button
              type="submit"
              [disabled]="form.invalid || isSubmitting()"
              class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-7 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ buttonLabel() }}
            </button>
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

  readonly group = signal<Group | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly buttonLabel = signal('Entrar no grupo');

  readonly form = this.fb.nonNullable.group({
    participantName: ['', [Validators.required, Validators.minLength(2)]],
  });

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
      const group = await this.groupService.getGroupByInviteToken(token);
      if (!group) {
        this.error.set('Link de convite inválido ou expirado.');
        return;
      }
      if (group.status === 'drawn' || group.drawn_at !== null) {
        this.error.set('Este grupo já realizou o sorteio. Não é possível entrar agora.');
        return;
      }

      this.group.set(group);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const group = this.group();
    if (!group) {
      return;
    }

    const name = this.form.controls.participantName.value.trim();

    try {
      const existing = await this.participantService.getParticipantsByGroupId(group.id);
      const duplicate = existing.some(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      );
      if (duplicate) {
        this.error.set(`Já existe um participante com o nome "${name}" neste grupo.`);
        return;
      }
    } catch (error) {
      // Continuar mesmo se a verificação falhar — o banco tem unique constraints se necessário
    }

    this.isSubmitting.set(true);
    this.buttonLabel.set('Confirmando...');

    try {
      const participant = await this.participantService.addParticipant(
        group.id,
        name,
      );

      const storedPersonal = this.readTokenList('my_personal_tokens');
      if (!storedPersonal.includes(participant.personal_token)) {
        storedPersonal.push(participant.personal_token);
        localStorage.setItem('my_personal_tokens', JSON.stringify(storedPersonal));
      }

      this.buttonLabel.set('Entrada confirmada ✓');
      setTimeout(() => void this.router.navigateByUrl(`/revelar/${participant.personal_token}`), 400);
    } catch (error) {
      console.error(error);
      this.buttonLabel.set('Erro ao entrar');
      setTimeout(() => this.buttonLabel.set('Entrar no grupo'), 2200);
    } finally {
      this.isSubmitting.set(false);
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
