import {
  Injectable,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';

export interface DemoGroup {
  id: string;
  name: string;
  status: 'sorteado' | 'pendente' | 'aberto';
  participantCount: number;
  priceLimit: number;
  revealDate: string;
}

const fallbackGroups: DemoGroup[] = [
  {
    id: 'natal-silva',
    name: 'Natal da Família Silva',
    status: 'sorteado',
    participantCount: 12,
    priceLimit: 100,
    revealDate: '2024-12-25',
  },
  {
    id: 'firma',
    name: 'Amigos da Firma',
    status: 'pendente',
    participantCount: 8,
    priceLimit: 50,
    revealDate: '2024-12-20',
  },
];

@Injectable({ providedIn: 'root' })
export class GroupDemoService {
  readonly groups: WritableSignal<DemoGroup[]> = signal<DemoGroup[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedGroupId = signal<string>('natal-silva');
  readonly selectedGroup = computed<DemoGroup | undefined>(() =>
    this.groups().find((group) => group.id === this.selectedGroupId()),
  );
  readonly totalParticipants = computed<number>(() =>
    this.groups().reduce((total, group) => total + group.participantCount, 0),
  );

  constructor() {
    effect(() => {
      const selectedGroup = this.selectedGroup();
      if (selectedGroup) {
        localStorage.setItem('selected-demo-group', selectedGroup.id);
      }
    });
  }

  async loadGroups(): Promise<void> {
    this.isLoading.set(true);

    try {
      const response = await fetch('http://localhost:3001/groups');
      if (!response.ok) {
        throw new Error(`Mock API returned ${response.status}`);
      }
      const groups = (await response.json()) as DemoGroup[];
      this.groups.set(groups);
    } catch {
      this.groups.set(fallbackGroups);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectGroup(groupId: string): void {
    this.selectedGroupId.set(groupId);
  }
}
