import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DesktopSidebarComponent } from '../desktop-sidebar/desktop-sidebar.component';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [DesktopSidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="text-neutral hidden min-h-dvh bg-[#f8f8fb] font-sans antialiased lg:block"
    >
      <app-desktop-sidebar />
      <main class="ml-[292px] px-10 py-10">
        <div class="mx-auto max-w-7xl">
          <ng-content />
        </div>
      </main>
    </div>
  `,
})
export class DashboardShellComponent {}
