import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Avatar do usuário com menu suspenso de conta.
 * Quando autenticado: abre um dropdown com o e-mail e a ação "Sair".
 * Quando anônimo: renderiza apenas o avatar estático (sem menu).
 */
@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [AppAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (auth.isAuthenticated()) {
      <div class="relative">
        <button
          type="button"
          class="focus:ring-primary-300 rounded-full focus:ring-2 focus:outline-none active:scale-[0.98]"
          [attr.aria-expanded]="open()"
          aria-haspopup="menu"
          aria-label="Abrir menu da conta"
          (click)="toggle()"
        >
          <app-avatar [initials]="initials()" sizeClass="size-10 text-xs" />
        </button>

        @if (open()) {
          <button
            type="button"
            class="fixed inset-0 z-40 cursor-default"
            aria-hidden="true"
            tabindex="-1"
            (click)="close()"
          ></button>

          <div
            class="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-[#ececf3] bg-white p-2 shadow-[0_18px_45px_rgba(26,26,46,0.12)]"
            role="menu"
          >
            <div class="px-3 py-2">
              <p class="text-[11px] font-bold tracking-wide text-neutral-400 uppercase">
                Conectado como
              </p>
              <p class="text-neutral mt-1 truncate text-sm font-bold">
                {{ email() }}
              </p>
            </div>
            <hr class="my-1 border-neutral-100" />
            <button
              type="button"
              role="menuitem"
              class="text-error hover:bg-error/10 focus:bg-error/10 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-extrabold transition focus:outline-none"
              (click)="logout()"
            >
              <svg
                class="size-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12H3m0 0 4-4m-4 4 4 4m6-11h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"
                />
              </svg>
              Sair
            </button>
          </div>
        }
      </div>
    } @else {
      <app-avatar [initials]="initials()" sizeClass="size-10 text-xs" />
    }
  `,
})
export class UserMenuComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly open = signal(false);

  readonly email = computed(() => this.auth.user()?.email ?? '');

  readonly initials = computed(() => {
    const user = this.auth.user();
    const source =
      (user?.user_metadata?.['display_name'] as string | undefined) ??
      user?.email ??
      '';
    const trimmed = source.trim();
    if (!trimmed) return 'EU';
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  });

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  async logout(): Promise<void> {
    this.open.set(false);
    await this.auth.signOut();
    void this.router.navigateByUrl('/');
  }
}
