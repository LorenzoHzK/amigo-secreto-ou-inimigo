import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-mobile-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-base-200 text-neutral min-h-dvh w-full font-sans antialiased lg:hidden"
      [class]="outerClass()"
    >
      <div
        class="bg-base-200 mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden shadow-none"
        [class]="innerClass()"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class MobileShellComponent {
  outerClass = input<string>('');
  innerClass = input<string>('');
}
