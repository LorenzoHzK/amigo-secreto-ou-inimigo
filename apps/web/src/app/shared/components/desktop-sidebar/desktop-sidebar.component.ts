import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
    </aside>
  `,
})
export class DesktopSidebarComponent {
  readonly items: DesktopSidebarItem[] = [
    { label: 'Meus Grupos', path: '/grupos', icon: '◉', active: true },
    { label: 'Novo Grupo', path: '/criar', icon: '+', active: false },
  ];
}
