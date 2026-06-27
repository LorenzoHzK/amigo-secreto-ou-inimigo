import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';
import { AuthService } from '../../../core/services/auth.service';

interface DesktopSidebarItem {
  label: string;
  path: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-desktop-sidebar',
  standalone: true,
  imports: [RouterLink, AppAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="fixed top-0 left-0 hidden h-dvh w-[292px] border-r border-[#ececf3] bg-white px-6 py-7 shadow-[14px_0_45px_rgba(26,26,46,0.035)] lg:block"
    >
      <a
        routerLink="/"
        class="focus:ring-primary-300 flex items-center gap-3 rounded-full focus:ring-2 focus:outline-none"
        aria-label="Ir para home"
      >
        <span
          class="bg-primary shadow-brand grid size-11 place-items-center rounded-full text-xl text-white"
          aria-hidden="true"
          >🎁</span
        >
        <span class="text-neutral text-lg leading-tight font-black"
          >Amigo Secreto</span
        >
      </a>

      <nav class="mt-11 space-y-2" aria-label="Menu lateral desktop">
        @for (item of items; track item.label) {
          <a
            [routerLink]="item.path"
            class="focus:ring-primary-300 flex items-center gap-3 rounded-[1.15rem] px-4 py-3.5 text-sm font-extrabold transition focus:ring-2 focus:outline-none"
            [class]="
              item.active
                ? 'bg-primary shadow-brand text-white'
                : 'hover:bg-primary-50 hover:text-primary text-neutral-500'
            "
          >
            <span
              class="grid size-7 place-items-center rounded-full bg-white/15 text-base"
              aria-hidden="true"
              >{{ item.icon }}</span
            >
            {{ item.label }}
          </a>
        }
      </nav>

      @if (auth.isAuthenticated()) {
        <div
          class="absolute inset-x-6 bottom-7 flex items-center gap-3 rounded-2xl border border-[#ececf3] bg-[#f8f8fb] p-3"
        >
          <app-avatar [initials]="initials()" sizeClass="size-9 text-[11px]" />
          <div class="min-w-0 flex-1">
            <p class="text-neutral truncate text-xs font-bold">{{ email() }}</p>
            <button
              type="button"
              class="text-error text-xs font-extrabold hover:underline focus:outline-none"
              (click)="logout()"
            >
              Sair
            </button>
          </div>
        </div>
      }
    </aside>
  `,
})
export class DesktopSidebarComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly items: DesktopSidebarItem[] = [
    { label: 'Meus Grupos', path: '/grupos', icon: '◉', active: true },
    { label: 'Novo Grupo', path: '/criar', icon: '+', active: false },
  ];

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

  async logout(): Promise<void> {
    await this.auth.signOut();
    void this.router.navigateByUrl('/');
  }
}
