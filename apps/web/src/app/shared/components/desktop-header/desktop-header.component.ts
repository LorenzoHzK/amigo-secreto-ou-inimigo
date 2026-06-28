import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [RouterLink, UserMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 hidden h-[72px] border-b border-[#ececf3] bg-white/95 shadow-[0_8px_30px_rgba(26,26,46,0.035)] backdrop-blur lg:block"
    >
      <div
        class="mx-auto flex h-full max-w-7xl items-center justify-between px-10"
      >
        <a
          [routerLink]="auth.isAuthenticated() ? '/grupos' : '/'"
          class="focus:ring-primary-300 flex items-center gap-3 rounded-full focus:ring-2 focus:outline-none"
          [attr.aria-label]="auth.isAuthenticated() ? 'Ir para meus grupos' : 'Ir para home'"
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
          <app-user-menu />
        </div>
      </div>
    </header>
  `,
})
export class DesktopHeaderComponent {
  readonly auth = inject(AuthService);
}
