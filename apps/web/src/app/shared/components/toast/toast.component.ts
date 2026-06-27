import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiErrorService } from '../../../core/services/api-error.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (apiError.message()) {
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        class="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap
               rounded-2xl bg-neutral px-6 py-4 text-sm font-bold text-white
               shadow-[0_24px_60px_rgba(26,26,46,0.24)] lg:bottom-8"
      >
        {{ apiError.message() }}
      </div>
    }
  `,
})
export class ToastComponent {
  readonly apiError = inject(ApiErrorService);
}
