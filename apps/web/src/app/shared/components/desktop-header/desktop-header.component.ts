import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [RouterLink, AppAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 hidden h-[72px] border-b border-[#ececf3] bg-white/95 shadow-[0_8px_30px_rgba(26,26,46,0.035)] backdrop-blur lg:block"
    >
      <div
        class="mx-auto flex h-full max-w-7xl items-center justify-between px-10"
      >
        <a
          routerLink="/"
          class="focus:ring-primary-300 flex items-center gap-3 rounded-full focus:ring-2 focus:outline-none"
          aria-label="Ir para home"
        >
          <span
            class="bg-primary shadow-brand grid size-10 place-items-center rounded-full text-xl text-white"
            aria-hidden="true"
          >
            🎁
          </span>
          <span class="text-neutral text-[1.05rem] font-black"
            >Amigo Secreto</span
          >
        </a>

        <div class="flex items-center gap-3">
          @if (auth.isAuthenticated()) {
            <a
              routerLink="/grupos"
              class="text-neutral hover:border-primary-200 hover:bg-primary-50 hover:text-primary focus:ring-primary-300 rounded-full border border-[#ececf3] bg-white px-5 py-2.5 text-sm font-extrabold transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            >
              Meus Grupos
            </a>
          } @else {
            <a
              routerLink="/login"
              class="text-neutral hover:border-primary-200 hover:bg-primary-50 hover:text-primary focus:ring-primary-300 rounded-full border border-[#ececf3] bg-white px-5 py-2.5 text-sm font-extrabold transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            >
              Entrar
            </a>
          }
          <app-avatar [initials]="userInitials()" sizeClass="size-10 text-xs" />
        </div>
      </div>
    </header>
  `,
})
export class DesktopHeaderComponent {
  readonly auth = inject(AuthService);

  readonly userInitials = computed(() => {
    const user = this.auth.user();
    if (!user || !user.email) return 'LS';
    const emailParts = user.email.split('@')[0];
    return emailParts.substring(0, 2).toUpperCase();
  });
}
