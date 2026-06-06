import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

type BottomNavItem = 'groups' | 'reveal' | 'admin';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="sticky bottom-0 z-30 mt-auto border-t border-neutral-100 bg-white/96 px-7 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-16px_42px_rgba(26,26,46,0.08)] backdrop-blur lg:hidden"
      aria-label="Navegação inferior"
    >
      <div class="grid grid-cols-3 items-end gap-3">
        <a
          routerLink="/grupos"
          class="focus:ring-primary-300 flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.15rem] px-2 text-[11px] font-extrabold transition focus:ring-2 focus:outline-none"
          [class]="itemClass('groups')"
          aria-label="Abrir meus grupos"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.1a2 2 0 0 1 1.6.8l.6.8a2 2 0 0 0 1.6.8h4.1A2.5 2.5 0 0 1 19 9.9v6.6A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5v-9Z"
            />
          </svg>
          Grupos
        </a>
        <a
          routerLink="/revelar/demo"
          class="focus:ring-primary-300 flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.15rem] px-2 text-[11px] font-extrabold transition focus:ring-2 focus:outline-none"
          [class]="itemClass('reveal')"
          aria-label="Abrir revelação"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v18m7-7H5m13.5-6.5-13 13m0-13 13 13"
            />
          </svg>
          Revelar
        </a>
        <a
          routerLink="/admin/demo"
          class="focus:ring-primary-300 flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.15rem] px-2 text-[11px] font-extrabold transition focus:ring-2 focus:outline-none"
          [class]="itemClass('admin')"
          aria-label="Abrir painel admin"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.04.04a2.06 2.06 0 0 1-2.91 2.91l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.06A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.04.04a2.06 2.06 0 1 1-2.91-2.91l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.06A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.04-.04a2.06 2.06 0 0 1 2.91-2.91l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.06A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.04-.04a2.06 2.06 0 0 1 2.91 2.91l-.04.04A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.06A1.7 1.7 0 0 0 19.4 15Z"
            />
          </svg>
          Admin
        </a>
      </div>
    </nav>
  `,
})
export class BottomNavComponent {
  active = input.required<BottomNavItem>();

  itemClass(item: BottomNavItem): string {
    return this.active() === item
      ? 'bg-primary-50 text-primary shadow-[0_10px_24px_rgba(108,59,255,0.10)]'
      : 'text-neutral-400 hover:text-neutral';
  }
}
