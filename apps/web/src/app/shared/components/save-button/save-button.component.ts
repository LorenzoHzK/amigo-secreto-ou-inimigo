import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || isLoading()"
      (click)="onClick()"
      class="focus:ring-primary-300 relative flex cursor-pointer items-center justify-center gap-2 px-6 py-3 font-sans font-semibold tracking-wide text-white transition-all duration-300 ease-out select-none focus:ring-2 focus:ring-offset-2 focus:outline-hidden active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
      [ngClass]="{
        'bg-primary hover:bg-primary-700 shadow-brand hover:shadow-brand-lg':
          !isLoading() && !isSuccess() && !disabled(),
        'bg-success hover:bg-success shadow-success/20 shadow-md': isSuccess() && !disabled(),
        'bg-primary-400 shadow-none': isLoading() && !disabled(),
        'bg-neutral-200 text-neutral-400 shadow-none': disabled(),
      }"
      [style.width]="width() ? width() : 'auto'"
    >
      <!-- Loading Spinner Container -->
      <span
        class="flex items-center justify-center transition-all duration-300 ease-out"
        [ngClass]="{
          'w-5 opacity-100': isLoading(),
          'w-0 overflow-hidden opacity-0': !isLoading(),
        }"
      >
        <svg class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </span>

      <!-- Standard Icon (Save Diskette/Arrow-Down) Container -->
      <span
        class="flex items-center justify-center transition-all duration-300 ease-out"
        [ngClass]="{
          'w-5 scale-100 opacity-100': !isLoading() && !isSuccess(),
          'w-0 scale-50 overflow-hidden opacity-0': isLoading() || isSuccess(),
        }"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          ></path>
        </svg>
      </span>

      <!-- Success Check Icon Container -->
      <span
        class="flex items-center justify-center transition-all duration-300 ease-out"
        [ngClass]="{
          'w-5 scale-100 opacity-100': isSuccess() && !isLoading(),
          'w-0 scale-50 overflow-hidden opacity-0': !isSuccess() || isLoading(),
        }"
      >
        <svg
          class="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
        </svg>
      </span>

      <!-- Label Text Container -->
      <span class="relative overflow-hidden transition-all duration-300 ease-out">
        @if (isSuccess()) {
          <span class="animate-fade-in inline-block">{{ successLabel() }}</span>
        } @else if (isLoading()) {
          <span class="animate-fade-in inline-block">{{ loadingLabel() }}</span>
        } @else {
          <span class="animate-fade-in inline-block">{{ label() }}</span>
        }
      </span>

      <!-- Glassmorphic hover highlight overlay -->
      <span
        class="rounded-brand pointer-events-none absolute inset-0 h-full w-full bg-white/5 opacity-0 transition-opacity duration-300 hover:opacity-100"
      ></span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .rounded-brand {
        border-radius: var(--radius-brand, 9999px);
      }

      button {
        border-radius: var(--radius-brand, 9999px);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(2px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  ],
})
export class SaveButtonComponent {
  // Inputs baseados em Signals (novidade do Angular 21+)
  label = input<string>('Salvar');
  loadingLabel = input<string>('Salvando...');
  successLabel = input<string>('Salvo!');
  width = input<string>(''); // Exemplo: '200px', '100%', etc.
  type = input<'button' | 'submit'>('button');
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  isSuccess = input<boolean>(false);

  // Output baseado em Signals (novidade do Angular 21+)
  save = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.isLoading()) {
      this.save.emit();
    }
  }
}
