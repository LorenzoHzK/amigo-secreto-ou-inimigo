import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-info-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] leading-none font-extrabold tracking-[0.08em] uppercase"
      [class]="toneClass()"
    >
      @if (icon()) {
        <span aria-hidden="true">{{ icon() }}</span>
      }
      {{ label() }}
    </span>
  `,
})
export class InfoBadgeComponent {
  label = input.required<string>();
  icon = input<string>('');
  toneClass = input<string>(
    'border-primary-100 bg-primary-50 text-primary-700',
  );
}
