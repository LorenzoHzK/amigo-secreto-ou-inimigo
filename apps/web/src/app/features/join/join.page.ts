import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GroupPublicView } from '../../core/models';
import { GroupService } from '../../core/services/group.service';

@Component({
  selector: 'app-join-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex min-h-dvh max-w-xl items-center px-5 py-10">
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
        <div class="w-full rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]">
          <div class="bg-primary-50 mx-auto grid size-16 place-items-center rounded-full text-3xl" aria-hidden="true">🎁</div>
          <p class="text-primary mt-6 text-xs font-black tracking-[0.2em] uppercase">Você foi convidado</p>
          <h1 class="text-neutral mt-3 text-3xl leading-tight font-black">{{ group()?.name }}</h1>
          <p class="mx-auto mt-5 max-w-md text-sm leading-6 font-medium text-neutral-500">
            Para ver o seu par, use o <strong>link individual</strong> que o organizador
            enviou para você. Cada participante tem o seu link privado de revelação.
          </p>
          <p class="mx-auto mt-3 max-w-md text-xs leading-5 font-medium text-neutral-400">
            Ainda não recebeu? Peça ao organizador para reenviar o seu link.
          </p>
          <a routerLink="/" class="btn btn-primary mt-7 rounded-full">Voltar ao início</a>
        </div>
      }
    </section>
  `,
})
export class JoinPage {
  readonly inviteToken = input.required<string>();

  private readonly groupService = inject(GroupService);

  readonly group = signal<GroupPublicView | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

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
      this.group.set(group);
    } catch (error) {
      console.error(error);
      this.error.set('Erro ao carregar o grupo. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
