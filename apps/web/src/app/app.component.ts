import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiErrorService } from './core/services/api-error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly apiError = inject(ApiErrorService);

  readonly error = this.apiError.message;

  dismissError(): void {
    this.apiError.clear();
  }
}
