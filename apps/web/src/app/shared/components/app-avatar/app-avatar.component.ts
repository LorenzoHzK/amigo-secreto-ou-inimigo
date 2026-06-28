import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="from-primary-100 to-secondary-100 text-primary grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold shadow-sm ring-2 ring-white"
      [class]="sizeClass()"
      [attr.aria-label]="ariaLabel()"
      role="img"
    >
      <span>{{ initials() }}</span>
    </div>
  `,
})
export class AppAvatarComponent {
  initials = input<string>('AS');
  ariaLabel = input<string>('Avatar do usuário');
  sizeClass = input<string>('size-11 text-sm');
}
