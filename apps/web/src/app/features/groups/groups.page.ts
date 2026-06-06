import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AppAvatarComponent } from '../../shared/components/app-avatar/app-avatar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import {
  GroupCardAvatar,
  GroupCardComponent,
} from '../../shared/components/group-card/group-card.component';
import { InfoBadgeComponent } from '../../shared/components/info-badge/info-badge.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { DashboardShellComponent } from '../../shared/components/dashboard-shell/dashboard-shell.component';
import {
  DesktopGroupCard,
  GroupGridComponent,
} from '../../shared/components/group-grid/group-grid.component';
import { GroupDemoService } from '../../core/services/group-demo.service';

interface GroupMock {
  type: string;
  status: string;
  statusClass: string;
  title: string;
  date: string;
  priceRange: string;
  actionLabel: string;
  avatars: GroupCardAvatar[];
}

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [
    AppAvatarComponent,
    BottomNavComponent,
    GroupCardComponent,
    InfoBadgeComponent,
    MobileShellComponent,
    DashboardShellComponent,
    GroupGridComponent,
    UpperCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-shell>
      <header class="flex items-center justify-between px-6 pt-7 pb-4">
        <div class="flex items-center gap-3">
          <div
            class="bg-primary shadow-brand grid size-11 place-items-center rounded-full text-xl text-white"
            aria-hidden="true"
          >
            🎁
          </div>
          <p class="text-neutral text-sm leading-tight font-black">
            Amigo Secreto
            <span
              class="text-primary block text-[11px] font-black tracking-[0.16em] uppercase"
              >ou Inimigo</span
            >
          </p>
        </div>
        <app-avatar initials="LS" />
      </header>

      <main class="flex-1 space-y-5 px-6 pb-8">
        <section>
          <app-info-badge label="Gerencie suas trocas" />
          <h1 class="text-neutral mt-5 text-[2.85rem] leading-none font-black">
            Meus Grupos
          </h1>
          <p class="mt-4 text-[0.98rem] leading-7 font-medium text-neutral-400">
            Acompanhe todos os sorteios e listas de presentes em um só lugar.
          </p>
        </section>

        @for (group of groups(); track group.title) {
          <app-group-card
            [type]="group.type"
            [status]="group.status"
            [statusClass]="group.statusClass"
            [title]="group.title"
            [date]="group.date"
            [priceRange]="group.priceRange"
            [actionLabel]="group.actionLabel"
            [avatars]="group.avatars"
          />
        }

        <button
          type="button"
          class="border-primary-200 text-primary focus:ring-primary-300 flex min-h-36 w-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed bg-white/60 transition hover:bg-white focus:ring-2 focus:outline-none active:scale-[0.98]"
          aria-label="Criar novo grupo"
          (click)="goToCreate()"
        >
          <span class="text-4xl leading-none font-light">+</span>
          <span class="mt-3 text-base font-black">Criar Novo Grupo</span>
        </button>
      </main>

      <app-bottom-nav active="groups" />
    </app-mobile-shell>

    <app-dashboard-shell>
      <header class="flex items-center justify-between gap-6">
        <div>
          <span
            class="border-primary-100 bg-primary-50 text-primary inline-flex rounded-full border px-4 py-2 text-xs font-black tracking-[0.16em] uppercase"
            >{{ 'Gerencie suas trocas' | uppercase }}</span
          >
          <h1 class="text-neutral mt-5 text-5xl font-black">Meus Grupos</h1>
          <p class="mt-3 text-base font-medium text-neutral-400">
            Acompanhe todos os sorteios e listas de presentes em um só lugar.
          </p>
        </div>
        <button
          type="button"
          class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 rounded-full px-7 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
          (click)="goToCreate()"
        >
          Nova Troca
        </button>
      </header>

      <section class="mt-10">
        <app-group-grid [groups]="desktopGroups" />
        <button
          type="button"
          class="border-primary-200 text-primary focus:ring-primary-300 mt-6 flex min-h-44 w-full items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed bg-white/70 transition hover:bg-white focus:ring-2 focus:outline-none active:scale-[0.98]"
          (click)="goToCreate()"
        >
          <span
            class="bg-primary-50 grid size-12 place-items-center rounded-full text-3xl font-light"
            >+</span
          >
          <span class="text-lg font-black">Criar Novo Grupo</span>
        </button>
      </section>

      <section
        class="bg-neutral mt-10 flex min-h-64 items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] p-10 text-white shadow-[0_24px_70px_rgba(26,26,46,0.16)]"
      >
        <div class="max-w-xl">
          <p
            class="text-primary-200 text-xs font-black tracking-[0.18em] uppercase"
          >
            Modo especial
          </p>
          <h2 class="mt-3 text-4xl leading-tight font-black">
            Amigo Inimigo:<br />A Arte da Trolagem
          </h2>
          <p class="mt-4 text-base leading-7 text-white/65">
            Transforme a troca em um desafio criativo, com regras leves e
            presentes inesperados.
          </p>
        </div>
        <div class="flex gap-4">
          <button
            type="button"
            class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 rounded-full px-7 py-4 text-sm font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            (click)="activateEnemyMode()"
          >
            {{ enemyLabel() }}
          </button>
          <button
            type="button"
            class="text-neutral hover:bg-primary-50 rounded-full bg-white px-7 py-4 text-sm font-extrabold transition focus:ring-2 focus:ring-white focus:outline-none active:scale-[0.98]"
            (click)="showRules()"
          >
            {{ rulesLabel() }}
          </button>
        </div>
      </section>
    </app-dashboard-shell>
  `,
})
export class GroupsPage {
  private readonly router = inject(Router);
  readonly demoService = inject(GroupDemoService);
  readonly enemyLabel = signal<string>('Descubra Inimigo');
  readonly rulesLabel = signal<string>('Ver Regras');

  constructor() {
    effect(() => {
      localStorage.setItem(
        'demo-total-participants',
        String(this.demoService.totalParticipants()),
      );
    });
    void this.demoService.loadGroups();
  }

  readonly desktopGroups: DesktopGroupCard[] = [
    {
      name: 'Natal da Família Silva',
      status: 'Sorteado',
      statusClass: 'bg-accent',
      participants: '12 participantes confirmados',
      value: 'R$ 50 - R$ 100',
      action: 'Revelar',
      avatars: ['AS', 'MR', 'SJ'],
    },
    {
      name: 'Amigos da Firma',
      status: 'Pendente',
      statusClass: 'bg-warning',
      participants: '8 participantes convidados',
      value: 'Até R$ 50',
      action: 'Detalhes',
      avatars: ['MC', 'LR', 'DT'],
    },
    {
      name: 'Curadoria Digital',
      status: 'Aberto',
      statusClass: 'bg-primary',
      participants: '5 participantes ativos',
      value: 'R$ 80 - R$ 150',
      action: 'Gerenciar',
      avatars: ['LS', 'SB', 'AR'],
    },
  ];

  goToCreate(): void {
    void this.router.navigateByUrl('/criar');
  }

  activateEnemyMode(): void {
    this.enemyLabel.set('Modo ativado ✓');
  }

  showRules(): void {
    this.rulesLabel.set('Sem presentes óbvios ✓');
    setTimeout(() => this.rulesLabel.set('Ver Regras'), 2200);
  }

  readonly groups = signal<GroupMock[]>([
    {
      type: 'Amigo Secreto',
      status: 'Sorteado',
      statusClass: 'border-accent-100 bg-accent-50 text-accent-800',
      title: 'Natal da Família Silva',
      date: '25 de Dezembro',
      priceRange: 'R$ 50 - R$ 100',
      actionLabel: 'Revelar Amigo',
      avatars: [{ initials: 'AS' }, { initials: 'MR' }, { initials: 'SJ' }],
    },
    {
      type: 'Happy Hour',
      status: 'Pendente',
      statusClass: 'border-warning/20 bg-warning/10 text-warning',
      title: 'Amigos da Firma',
      date: 'Sorteio em 20 de Dezembro',
      priceRange: 'Até R$ 50',
      actionLabel: 'Ver Detalhes',
      avatars: [{ initials: 'MC' }, { initials: 'LR' }],
    },
  ]);
}
