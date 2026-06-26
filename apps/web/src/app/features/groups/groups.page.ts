import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
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
import { GroupService } from '../../core/services/group.service';
import { ParticipantService } from '../../core/services/participant.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiErrorService } from '../../core/services/api-error.service';

interface GroupMock {
  type: string;
  status: string;
  statusClass: string;
  title: string;
  date: string;
  priceRange: string;
  actionLabel: string;
  avatars: GroupCardAvatar[];
  routeUrl: string;
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
        <app-avatar [initials]="userInitials()" />
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

        @if (isLoading()) {
          <div
            class="flex flex-col items-center justify-center py-10 text-neutral-400"
          >
            <span
              class="loading loading-spinner loading-lg text-primary"
            ></span>
            <p class="mt-4 text-sm font-bold">Buscando seus grupos...</p>
          </div>
        } @else {
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
              [routeUrl]="group.routeUrl"
            />
          } @empty {
            <div
              class="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
            >
              <p class="text-sm font-bold text-neutral-400">
                Você não participa de nenhum grupo ainda.
              </p>
            </div>
          }
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
        @if (isLoading()) {
          <div
            class="flex flex-col items-center justify-center py-20 text-neutral-400"
          >
            <span
              class="loading loading-spinner loading-lg text-primary"
            ></span>
            <p class="mt-4 text-sm font-bold">Buscando seus grupos...</p>
          </div>
        } @else {
          @if (desktopGroups().length > 0) {
            <app-group-grid [groups]="desktopGroups()" />
          } @else {
            <div
              class="rounded-[2rem] bg-white p-12 text-center shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
            >
              <p class="text-base font-bold text-neutral-400">
                Você não participa de nenhum grupo ainda.
              </p>
            </div>
          }
        }

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
export class GroupsPage implements OnInit {
  private readonly router = inject(Router);
  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);
  private readonly auth = inject(AuthService);
  private readonly apiError = inject(ApiErrorService);

  readonly enemyLabel = signal<string>('Descubra Inimigo');
  readonly rulesLabel = signal<string>('Ver Regras');

  readonly groups = signal<GroupMock[]>([]);
  readonly desktopGroups = signal<DesktopGroupCard[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly userInitials = computed(() => {
    const user = this.auth.user();
    if (!user || !user.email) return 'LS';
    const emailParts = user.email.split('@')[0];
    return emailParts.substring(0, 2).toUpperCase();
  });

  ngOnInit(): void {
    void this.loadGroups();
  }

  async loadGroups(): Promise<void> {
    this.isLoading.set(true);
    try {
      if (this.auth.isAuthenticated() && this.auth.user()?.id) {
        await this.loadGroupsFromDatabase();
      } else {
        await this.loadGroupsFromLocalStorage();
      }
    } catch (error) {
      console.error(error);
      this.apiError.report('Erro ao carregar grupos. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadGroupsFromDatabase(): Promise<void> {
    const userId = this.auth.user()!.id;
    const groups = await this.groupService.getGroupsByOwnerId(userId);
    const cards: GroupMock[] = [];
    const dCards: DesktopGroupCard[] = [];

    for (const group of groups) {
      const participants =
        await this.participantService.getParticipantsByGroupId(group.id);
      const initialsList = participants
        .slice(0, 3)
        .map((p) => this.getInitials(p.name));
      const statusStr = group.drawn_at ? 'Sorteado' : 'Aberto';
      const statusClass = group.drawn_at
        ? 'border-accent-100 bg-accent-50 text-accent-800'
        : 'border-primary-100 bg-primary-50 text-primary-800';

      const priceLimit = group.price_limit;
      const priceStr = priceLimit
        ? `Limite: R$ ${priceLimit}`
        : 'Sem limite de preço';

      cards.push({
        type: 'Organizador',
        status: statusStr,
        statusClass,
        title: group.name,
        date: group.drawn_at ? 'Sorteio realizado' : 'Aguardando sorteio',
        priceRange: priceStr,
        actionLabel: 'Gerenciar',
        avatars: initialsList.map((init) => ({ initials: init })),
        routeUrl: `/admin/${group.admin_token}`,
      });

      dCards.push({
        name: group.name,
        status: statusStr,
        statusClass: group.drawn_at ? 'bg-accent' : 'bg-primary',
        participants: `${participants.length} participantes`,
        value: priceStr,
        action: 'Gerenciar',
        avatars: initialsList,
        actionUrl: `/admin/${group.admin_token}`,
      });
    }

    this.groups.set(cards);
    this.desktopGroups.set(dCards);
  }

  private async loadGroupsFromLocalStorage(): Promise<void> {
    let storedAdmin: string[] = [];
    let storedPersonal: string[] = [];
    try {
      storedAdmin = JSON.parse(
        localStorage.getItem('my_admin_tokens') || '[]',
      );
      storedPersonal = JSON.parse(
        localStorage.getItem('my_personal_tokens') || '[]',
      );
    } catch {
      // Ignorar erro de parsing
    }

    const cards: GroupMock[] = [];
    const dCards: DesktopGroupCard[] = [];

    // 1. Carregar grupos onde o usuário é organizador em paralelo
    const adminGroupsResults = await Promise.all(
      storedAdmin.map(async (token) => {
        const group = await this.groupService.getGroupByAdminToken(token);
        if (!group) return null;
        const participants =
          await this.participantService.getParticipantsByGroupId(group.id);
        return { group, participants };
      }),
    );

    // Filtrar os nulos e registrar os IDs para evitar duplicidades
    const validAdminGroups = adminGroupsResults.filter(
      (r): r is { group: any; participants: any[] } => r !== null,
    );
    const adminGroupIds = new Set(validAdminGroups.map((r) => r.group.id));

    // 2. Carregar participações em paralelo
    const personalParticipantsResults = await Promise.all(
      storedPersonal.map(async (token) => {
        const p =
          await this.participantService.getParticipantByPersonalToken(token);
        if (!p) return null;

        // Se já carregamos este grupo como administrador, não faz sentido buscar grupo/participantes novamente
        if (adminGroupIds.has(p.group_id)) return null;

        const group = await this.groupService.getGroupById(p.group_id);
        if (!group) return null;

        const participants =
          await this.participantService.getParticipantsByGroupId(group.id);
        return { participant: p, group, participants };
      }),
    );

    const validPersonalGroups = personalParticipantsResults.filter(
      (r): r is { participant: any; group: any; participants: any[] } =>
        r !== null,
    );

    // Processar grupos de organizador
    for (const { group, participants } of validAdminGroups) {
      const initialsList = participants
        .slice(0, 3)
        .map((p) => this.getInitials(p.name));
      const statusStr = group.drawn_at ? 'Sorteado' : 'Aberto';
      const statusClass = group.drawn_at
        ? 'border-accent-100 bg-accent-50 text-accent-800'
        : 'border-primary-100 bg-primary-50 text-primary-800';

      const priceLimit = group.price_limit;
      const priceStr = priceLimit
        ? `Limite: R$ ${priceLimit}`
        : 'Sem limite de preço';

      cards.push({
        type: 'Organizador',
        status: statusStr,
        statusClass,
        title: group.name,
        date: group.drawn_at ? 'Sorteio realizado' : 'Aguardando sorteio',
        priceRange: priceStr,
        actionLabel: 'Gerenciar',
        avatars: initialsList.map((init) => ({ initials: init })),
        routeUrl: `/admin/${group.admin_token}`,
      });

      dCards.push({
        name: group.name,
        status: statusStr,
        statusClass: group.drawn_at ? 'bg-accent' : 'bg-primary',
        participants: `${participants.length} participantes`,
        value: priceStr,
        action: 'Gerenciar',
        avatars: initialsList,
        actionUrl: `/admin/${group.admin_token}`,
      });
    }

    // Processar grupos de participante
    for (const { participant, group, participants } of validPersonalGroups) {
      const initialsList = participants
        .slice(0, 3)
        .map((pt) => this.getInitials(pt.name));
      const statusStr = group.drawn_at ? 'Sorteado' : 'Aberto';
      const statusClass = group.drawn_at
        ? 'border-accent-100 bg-accent-50 text-accent-800'
        : 'border-primary-100 bg-primary-50 text-primary-800';

      const priceLimit = group.price_limit;
      const priceStr = priceLimit
        ? `Limite: R$ ${priceLimit}`
        : 'Sem limite de preço';

      cards.push({
        type: 'Participante',
        status: statusStr,
        statusClass,
        title: group.name,
        date: group.drawn_at ? 'Sorteio realizado' : 'Aguardando sorteio',
        priceRange: priceStr,
        actionLabel: group.drawn_at ? 'Revelar Amigo' : 'Ver Detalhes',
        avatars: initialsList.map((init) => ({ initials: init })),
        routeUrl: `/revelar/${participant.personal_token}`,
      });

      dCards.push({
        name: group.name,
        status: statusStr,
        statusClass: group.drawn_at ? 'bg-accent' : 'bg-primary',
        participants: `${participants.length} participantes`,
        value: priceStr,
        action: group.drawn_at ? 'Revelar' : 'Detalhes',
        avatars: initialsList,
        actionUrl: `/revelar/${participant.personal_token}`,
      });
    }

    this.groups.set(cards);
    this.desktopGroups.set(dCards);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

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
}
