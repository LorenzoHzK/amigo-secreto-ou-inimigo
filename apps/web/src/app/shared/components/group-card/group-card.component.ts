import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';
import { InfoBadgeComponent } from '../info-badge/info-badge.component';

export interface GroupCardAvatar {
  initials: string;
}

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [AppAvatarComponent, InfoBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(26,26,46,0.07)]"
    >
      <div class="mb-5 flex items-center justify-between gap-3">
        <app-info-badge [label]="type()" />
        <app-info-badge [label]="status()" [toneClass]="statusClass()" />
      </div>

      <h3 class="text-neutral text-[1.35rem] leading-tight font-black">
        {{ title() }}
      </h3>

      <div class="mt-4 grid gap-2 text-sm font-bold text-neutral-400">
        <p class="flex items-center gap-2">
          <svg
            class="text-primary size-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 3v3m10-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
            />
          </svg>
          {{ date() }}
        </p>
        <p class="flex items-center gap-2">
          <svg
            class="text-accent size-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m-4-3.5c0 1.38 1.8 2.5 4 2.5s4-1.12 4-2.5S14.2 12 12 12s-4-1.12-4-2.5S9.8 7 12 7s4 1.12 4 2.5"
            />
          </svg>
          {{ priceRange() }}
        </p>
      </div>

      <div class="mt-6 flex items-center justify-between gap-4">
        <div class="flex -space-x-3">
          @for (avatar of avatars(); track avatar.initials) {
            <app-avatar
              [initials]="avatar.initials"
              sizeClass="size-9 text-[10px]"
              [ariaLabel]="'Participante ' + avatar.initials"
            />
          }
        </div>
        <button
          type="button"
          class="bg-primary shadow-brand hover:bg-primary-700 focus:ring-primary-300 rounded-full px-5 py-3 text-sm font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
          (click)="openGroupAction()"
        >
          {{ actionLabel() }}
        </button>
      </div>
    </article>
  `,
})
export class GroupCardComponent {
  private readonly router = inject(Router);

  type = input.required<string>();
  status = input.required<string>();
  statusClass = input<string>('border-accent-100 bg-accent-50 text-accent-800');
  title = input.required<string>();
  date = input.required<string>();
  priceRange = input.required<string>();
  actionLabel = input.required<string>();
  avatars = input<GroupCardAvatar[]>([]);
  routeUrl = input<string>('');

  openGroupAction(): void {
    if (this.routeUrl()) {
      void this.router.navigateByUrl(this.routeUrl());
      return;
    }
    const label = this.actionLabel().toLowerCase();
    const target = label.includes('revelar') ? '/revelar/demo' : '/admin/demo';
    void this.router.navigateByUrl(target);
  }
}
