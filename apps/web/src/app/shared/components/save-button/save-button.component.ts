import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.css',
})
export class SaveButtonComponent {
  readonly saving = input(false);
  readonly disabled = input(false);
  readonly label = input('Salvar');
  readonly saved = input(false);

  readonly save = output<void>();

  onClick(): void {
    if (!this.saving() && !this.disabled()) {
      this.save.emit();
    }
  }
}
