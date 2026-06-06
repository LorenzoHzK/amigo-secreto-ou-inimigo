import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';

@Component({
  selector: 'app-create-group-page',
  standalone: true,
  imports: [MobileShellComponent, DesktopLayoutComponent, TextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-shell innerClass="bg-base-200">
      <header class="flex items-center gap-5 px-6 pt-7 pb-5">
        <button
          type="button"
          class="text-neutral focus:ring-primary-300 grid size-11 place-items-center rounded-full bg-white shadow-[0_10px_28px_rgba(26,26,46,0.06)] focus:ring-2 focus:outline-none"
          aria-label="Voltar"
          (click)="goBack()"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 6 9 12l6 6"
            />
          </svg>
        </button>
        <div>
          <p
            class="text-neutral text-xs font-black tracking-[0.18em] uppercase"
          >
            Amigo Secreto
          </p>
          <p
            class="text-primary text-[11px] font-black tracking-[0.24em] uppercase"
          >
            ou Inimigo
          </p>
        </div>
      </header>

      <main class="flex-1 px-6 pb-8">
        <section class="mb-7">
          <h1
            class="text-neutral max-w-[320px] text-[2.55rem] leading-[0.98] font-black"
          >
            Comece uma nova tradição
          </h1>
          <p class="mt-4 text-[0.98rem] leading-7 font-medium text-neutral-400">
            Crie seu grupo de Amigo Secreto em segundos. Defina o clima e deixe
            o resto conosco.
          </p>
        </section>

        <form class="space-y-4" aria-label="Criar grupo">
          <section
            class="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.06)]"
          >
            <app-text-field
              label="Nome do Grupo"
              helper="Como seu grupo será chamado?"
              placeholder="Ex: Natal em Família 2024"
              [(value)]="groupName"
              (committed)="lastCommittedField.set($event)"
            />
            <app-text-field
              label="Limite de Preço"
              helper="Qual o limite de valor? (Opcional)"
              prefix="R$"
              placeholder="0,00"
              inputMode="decimal"
              [(value)]="priceLimit"
              (committed)="lastCommittedField.set($event)"
            />
          </section>

          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              class="focus:ring-primary-300 rounded-[1.65rem] bg-white p-5 text-left shadow-[0_16px_40px_rgba(26,26,46,0.06)] transition focus:ring-2 focus:outline-none active:scale-[0.98]"
              [class.ring-2]="selectedOption() === 'date'"
              [class.ring-primary-200]="selectedOption() === 'date'"
              (click)="selectOption('date')"
            >
              <span
                class="bg-primary-50 text-primary grid size-11 place-items-center rounded-full"
              >
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 3v3m10-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                  />
                </svg>
              </span>
              <span class="text-neutral mt-4 block text-sm font-black"
                >Data do Reveal</span
              >
            </button>
            <button
              type="button"
              class="focus:ring-primary-300 rounded-[1.65rem] bg-white p-5 text-left shadow-[0_16px_40px_rgba(26,26,46,0.06)] transition focus:ring-2 focus:outline-none active:scale-[0.98]"
              [class.ring-2]="selectedOption() === 'privacy'"
              [class.ring-primary-200]="selectedOption() === 'privacy'"
              (click)="selectOption('privacy')"
            >
              <span
                class="bg-primary-50 text-primary grid size-11 place-items-center rounded-full"
              >
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 11.5v3m-5.5-5V7a5.5 5.5 0 0 1 11 0v2.5M6 9.5h12A1.5 1.5 0 0 1 19.5 11v8A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19v-8A1.5 1.5 0 0 1 6 9.5Z"
                  />
                </svg>
              </span>
              <span class="text-neutral mt-4 block text-sm font-black"
                >Privacidade</span
              >
            </button>
          </div>

          <button
            type="button"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-3 min-h-14 w-full rounded-full px-8 text-base font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
            (click)="createGroup()"
          >
            {{ createLabel() }}
          </button>
        </form>

        <p
          class="mx-auto mt-6 max-w-[300px] text-center text-[10px] leading-5 font-black tracking-[0.16em] text-neutral-300 uppercase"
        >
          Ao criar, você concorda com nossos termos de curadoria
        </p>
      </main>
    </app-mobile-shell>

    <app-desktop-layout>
      <section
        class="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-3xl flex-col items-center justify-center"
      >
        <form
          class="w-full max-w-[430px] rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_24px_70px_rgba(26,26,46,0.075)]"
          aria-label="Criar grupo desktop"
        >
          <div class="text-center">
            <p
              class="text-primary text-xs font-black tracking-[0.18em] uppercase"
            >
              Amigo Secreto
            </p>
            <h1
              class="text-neutral mt-4 text-[2.35rem] leading-tight font-black"
            >
              Comece uma nova tradição
            </h1>
            <p
              class="mx-auto mt-3 max-w-sm text-sm leading-6 font-medium text-neutral-400"
            >
              Configure o grupo, defina o limite e receba os links de convite.
            </p>
          </div>

          <div class="mt-7 space-y-5">
            <app-text-field
              label="Nome do grupo"
              placeholder="Ex: Natal em Família 2024"
              [(value)]="groupName"
              (committed)="lastCommittedField.set($event)"
            />
            <app-text-field
              label="Limite de preço"
              prefix="R$"
              placeholder="0,00"
              inputMode="decimal"
              [(value)]="priceLimit"
              (committed)="lastCommittedField.set($event)"
            />
          </div>
          <button
            type="button"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-7 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            (click)="createGroup()"
          >
            {{ createLabel() }}
          </button>
        </form>

        <aside
          class="border-primary-100 bg-primary-50 mt-5 w-full max-w-[430px] rounded-[1.75rem] border p-5 text-center shadow-[0_14px_35px_rgba(108,59,255,0.08)]"
        >
          <p class="text-neutral text-sm leading-6 font-bold">
            Ao criar, você recebe um link de administração e um convite seguro
            para participantes.
          </p>
          <p
            class="text-primary mt-2 text-[10px] font-black tracking-[0.16em] uppercase"
          >
            Curadoria privada e sem cadastro
          </p>
        </aside>
      </section>
    </app-desktop-layout>
  `,
})
export class CreateGroupPage {
  private readonly router = inject(Router);
  readonly selectedOption = signal<'date' | 'privacy' | null>(null);
  readonly groupName = model<string>('');
  readonly priceLimit = model<string>('');
  readonly lastCommittedField = signal<string>('');
  readonly createLabel = signal<string>('Criar grupo 🎉');

  selectOption(option: 'date' | 'privacy'): void {
    this.selectedOption.set(option);
  }

  createGroup(): void {
    this.createLabel.set('Grupo criado ✓');
    setTimeout(() => void this.router.navigateByUrl('/admin/demo'), 450);
  }

  goBack(): void {
    void this.router.navigateByUrl('/');
  }
}
