import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MobileLayoutComponent } from '../../layouts/mobile-layout/mobile-layout.component';

@Component({
  selector: 'app-mobile-shell',
  standalone: true,
  imports: [MobileLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-layout [outerClass]="outerClass()" [innerClass]="innerClass()">
      <ng-content />
    </app-mobile-layout>
  `,
})
export class MobileShellComponent {
  outerClass = input<string>('');
  innerClass = input<string>('');
}
