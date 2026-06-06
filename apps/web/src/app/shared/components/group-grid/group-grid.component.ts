import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';

export interface DesktopGroupCard {
  name: string;
  status: string;
  statusClass: string;
  participants: string;
  value: string;
  action: string;
  avatars: string[];
}

@Component({
  selector: 'app-group-grid',
  standalone: true,
  imports: [AppAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-3 gap-6">
      @for (group of groups(); track group.name) {
        <article
          class="min-h-[300px] rounded-[2rem] border border-[#ececf3] bg-white p-6 shadow-[0_18px_45px_rgba(26,26,46,0.055)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(26,26,46,0.08)]"
        >
          <div class="flex items-center justify-between gap-4">
            <span
              class="bg-primary-50 text-primary rounded-full px-3 py-1.5 text-[11px] font-black tracking-[0.12em] uppercase"
            >
              @switch (group.status) {
                @case ('Sorteado') {
                  ✓
                }
                @case ('Pendente') {
                  •
                }
                @default {
                  +
                }
              }
              {{ group.status }}
            </span>
            <span
              class="size-3 rounded-full"
              [class]="group.statusClass"
            ></span>
          </div>
          <h3
            class="text-neutral mt-6 min-h-16 text-2xl leading-tight font-black"
          >
            {{ group.name }}
          </h3>
          <div class="mt-5 space-y-3 text-sm font-bold text-neutral-400">
            <p>{{ group.participants }}</p>
            <p>{{ group.value }}</p>
          </div>
          <div class="mt-8 flex items-center justify-between gap-4">
            <div class="flex -space-x-3">
              @for (avatar of group.avatars; track avatar) {
                <app-avatar
                  [initials]="avatar"
                  sizeClass="size-10 text-[10px]"
                />
              }
            </div>
            <button
              type="button"
              class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 rounded-full px-5 py-3 text-sm font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
              (click)="openGroup(group.action)"
            >
              {{ group.action }}
            </button>
          </div>
        </article>
      }
    </div>
  `,
})
export class GroupGridComponent {
  private readonly router = inject(Router);
  groups = input.required<DesktopGroupCard[]>();

  openGroup(action: string): void {
    const target = action.toLowerCase().includes('revelar')
      ? '/revelar/demo'
      : '/admin/demo';
    void this.router.navigateByUrl(target);
  }
}
