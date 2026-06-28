import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="block" [class]="hostClass()">
      <span
        class="text-primary block text-[11px] font-black tracking-[0.16em] uppercase"
        >{{ label() | uppercase }}</span
      >
      @if (helper()) {
        <span class="mt-1 block text-sm font-bold text-neutral-400">
          {{ helper() }}
        </span>
      }
      <span
        class="focus-within:border-primary focus-within:ring-primary-100 mt-4 flex items-center rounded-full border border-[#ececf3] bg-[#f8f8fb] px-5 py-3.5 transition focus-within:ring-2"
      >
        @if (prefix()) {
          <span class="text-neutral pr-3 text-sm font-black">{{
            prefix()
          }}</span>
        }
        <input
          [type]="type()"
          [inputMode]="inputMode()"
          [autocomplete]="autocomplete()"
          [placeholder]="placeholder()"
          [value]="value()"
          (input)="onInput($event)"
          (change)="committed.emit(value())"
          class="text-neutral w-full bg-transparent text-sm font-bold outline-none placeholder:text-neutral-300"
        />
      </span>
    </label>
  `,
})
export class TextFieldComponent {
  label = input.required<string>();
  helper = input<string>('');
  placeholder = input<string>('');
  prefix = input<string>('');
  type = input<string>('text');
  inputMode = input<string>('text');
  autocomplete = input<string>('off');
  hostClass = input<string>('');
  value = model<string>('');
  committed = output<string>();

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value.set(inputElement.value);
  }
}
