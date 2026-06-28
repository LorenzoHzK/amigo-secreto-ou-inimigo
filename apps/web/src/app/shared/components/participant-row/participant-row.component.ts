import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { AppAvatarComponent } from '../app-avatar/app-avatar.component';

@Component({
  selector: 'app-participant-row',
  standalone: true,
  imports: [AppAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-center gap-3 rounded-[1.35rem] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(26,26,46,0.04)] transition"
      [class.opacity-45]="removed()"
    >
      <app-avatar
        [initials]="initials()"
        sizeClass="size-10 text-xs"
        [ariaLabel]="'Avatar de ' + name()"
      />
      <p class="text-neutral min-w-0 flex-1 truncate text-sm font-extrabold">
        {{ name() }}
      </p>
      @if (showStatus()) {
        <span
          class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide uppercase"
          [class]="
            claimed()
              ? 'bg-primary-50 text-primary'
              : 'bg-neutral-50 text-neutral-400'
          "
        >
          {{ claimed() ? 'Revelou' : 'Pendente' }}
        </span>
      }
      @if (showRemove()) {
        <button
          type="button"
          class="hover:bg-secondary-50 hover:text-secondary focus:ring-secondary-200 grid size-9 place-items-center rounded-full bg-neutral-50 text-neutral-400 transition focus:ring-2 focus:outline-none"
          [attr.aria-label]="'Remover ' + name()"
          (click)="onRemoveClick()"
        >
          <svg
            class="size-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 7h12m-9 0V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-8 0 1 13h8l1-13"
            />
          </svg>
        </button>
      }
    </div>
  `,
})
export class ParticipantRowComponent {
  name = input.required<string>();
  initials = input.required<string>();
  showRemove = input<boolean>(true);
  showStatus = input<boolean>(false);
  claimed = input<boolean>(false);
  readonly remove = output<void>();
  readonly removed = signal<boolean>(false);

  onRemoveClick(): void {
    this.remove.emit();
  }
}
