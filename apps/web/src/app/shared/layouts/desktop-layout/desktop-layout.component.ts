import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DesktopHeaderComponent } from '../../components/desktop-header/desktop-header.component';

@Component({
  selector: 'app-desktop-layout',
  standalone: true,
  imports: [DesktopHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="text-neutral hidden min-h-dvh bg-[#f8f8fb] font-sans antialiased lg:block"
      [class]="className()"
    >
      <app-desktop-header />
      <main class="mx-auto max-w-7xl px-10 pt-32 pb-20">
        <ng-content />
      </main>
    </div>
  `,
})
export class DesktopLayoutComponent {
  className = input<string>('');
}
