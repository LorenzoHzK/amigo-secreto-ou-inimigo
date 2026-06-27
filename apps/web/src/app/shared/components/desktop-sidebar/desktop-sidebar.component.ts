import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface DesktopSidebarItem {
  label: string;
  path: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-desktop-sidebar',
  standalone: true,
  imports: [RouterLink],
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

      <div
        class="bg-neutral absolute inset-x-6 bottom-7 rounded-[1.75rem] p-5 text-white shadow-[0_18px_40px_rgba(26,26,46,0.18)]"
      >
        <p class="text-sm font-black">Modo Inimigo</p>
        <p class="mt-2 text-xs leading-5 text-white/65">
          Ative desafios criativos para uma troca memorável.
        </p>
        <button
          type="button"
          class="text-neutral mt-4 rounded-full bg-white px-4 py-2 text-xs font-black transition active:scale-[0.98]"
          (click)="exploreEnemyMode()"
        >
          Explorar
        </button>
      </div>
    </aside>
  `,
})
export class DesktopSidebarComponent {
  private readonly router = inject(Router);

  readonly items: DesktopSidebarItem[] = [
    { label: 'Meus Grupos', path: '/grupos', icon: '◉', active: true },
    { label: 'Nova Troca', path: '/criar', icon: '+', active: false },
    { label: 'Configurações', path: '/grupos', icon: '⚙', active: false },
  ];

  exploreEnemyMode(): void {
    void this.router.navigateByUrl('/criar');
  }
}
