import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  readonly message = signal<string | null>(null);

  private timeoutId: number | null = null;

  report(message: string): void {
    this.message.set(message);

    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.message.set(null);
      this.timeoutId = null;
    }, 4500);
  }

  clear(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.message.set(null);
  }
}
