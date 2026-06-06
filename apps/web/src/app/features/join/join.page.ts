import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { InfoBadgeComponent } from '../../shared/components/info-badge/info-badge.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';

@Component({
  selector: 'app-join-page',
  standalone: true,
  imports: [
    InfoBadgeComponent,
    MobileShellComponent,
    DesktopLayoutComponent,
    TextFieldComponent,
    CurrencyPipe,
    UpperCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-shell outerClass="bg-primary-50" innerClass="bg-primary-50">
      <main class="flex min-h-dvh flex-1 flex-col justify-center px-6 py-8">
        <section
          class="rounded-[2.25rem] bg-white px-6 py-8 text-center shadow-[0_24px_70px_rgba(108,59,255,0.14)]"
        >
          <p class="text-neutral text-xs font-black tracking-[0.2em] uppercase">
            {{ 'Amigo Secreto' | uppercase }}
          </p>
          <p class="text-primary mt-1 text-xs font-black">ou Inimigo</p>

          <div
            class="bg-primary-50 mx-auto mt-7 grid size-20 place-items-center rounded-full text-4xl shadow-inner"
            aria-hidden="true"
          >
            🎉
          </div>

          <p
            class="text-primary mt-7 text-[11px] font-black tracking-[0.18em] uppercase"
          >
            Você foi convidado
          </p>
          <h1 class="text-neutral mt-3 text-[2rem] leading-tight font-black">
            Natal da Família Silva
          </h1>

          <div class="mt-5">
            <app-info-badge
              [label]="'Limite: ' + (150 | currency: 'BRL')"
              toneClass="border-primary-100 bg-primary-50 text-primary-700"
            />
          </div>

          <app-text-field
            label="Como devemos te chamar?"
            placeholder="Seu nome completo"
            autocomplete="name"
            hostClass="mt-8 text-left"
            [(value)]="participantName"
            (committed)="lastCommittedName.set($event)"
          />

          <p
            class="mt-4 text-left text-sm leading-6 font-medium text-neutral-400"
          >
            Depois de entrar, você poderá acompanhar a revelação e preparar sua
            lista de desejos com privacidade.
          </p>

          <button
            type="button"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-7 min-h-14 w-full rounded-full px-8 text-base font-extrabold text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
            (click)="joinGroup()"
          >
            {{ joinLabel() }}
          </button>
        </section>

        <p class="mt-6 text-center text-xs font-black text-neutral-400">
          Acesso Seguro & Privado
        </p>

        <div class="mt-5 grid grid-cols-2 gap-4">
          <article
            class="rounded-[1.5rem] bg-white/80 p-4 text-center shadow-[0_14px_35px_rgba(108,59,255,0.08)]"
          >
            <p class="text-neutral text-2xl font-black">12</p>
            <p class="mt-1 text-xs leading-4 font-bold text-neutral-400">
              Pessoas já entraram
            </p>
          </article>
          <article
            class="rounded-[1.5rem] bg-white/80 p-4 text-center shadow-[0_14px_35px_rgba(108,59,255,0.08)]"
          >
            <p class="text-neutral text-2xl font-black">24</p>
            <p class="mt-1 text-xs leading-4 font-bold text-neutral-400">
              Revelação em Dezembro
            </p>
          </article>
        </div>
      </main>
    </app-mobile-shell>

    <app-desktop-layout className="bg-primary-50/45">
      <section class="relative mx-auto grid max-w-5xl grid-cols-2 gap-8">
        <div
          class="bg-primary-200/40 absolute inset-20 -z-10 rounded-full blur-3xl"
        ></div>
        <article
          class="border-primary-100 rounded-[2.5rem] border bg-white/85 p-10 shadow-[0_24px_70px_rgba(108,59,255,0.12)] backdrop-blur"
        >
          <p class="text-primary text-xs font-black tracking-[0.2em] uppercase">
            Você foi convidado
          </p>
          <h1 class="text-neutral mt-5 text-5xl leading-tight font-black">
            Natal da Família Silva
          </h1>
          <div class="mt-6">
            <app-info-badge [label]="'Limite: ' + (150 | currency: 'BRL')" />
          </div>
          <p class="mt-7 text-base leading-7 font-medium text-neutral-400">
            Entre no grupo para participar da curadoria, acompanhar a data de
            revelação e preparar sua lista de desejos.
          </p>
          <div class="mt-10 grid grid-cols-2 gap-4">
            <div class="bg-primary-50 rounded-2xl p-5">
              <p class="text-neutral text-3xl font-black">12</p>
              <p class="mt-1 text-sm font-bold text-neutral-400">
                Pessoas já entraram
              </p>
            </div>
            <div class="bg-accent-50 rounded-2xl p-5">
              <p class="text-neutral text-3xl font-black">24</p>
              <p class="mt-1 text-sm font-bold text-neutral-400">Dezembro</p>
            </div>
          </div>
        </article>
        <form
          class="rounded-[2.5rem] border border-[#ececf3] bg-white p-10 shadow-[0_24px_70px_rgba(26,26,46,0.08)]"
          aria-label="Entrar no grupo desktop"
        >
          <span
            class="bg-primary-50 mx-auto grid size-20 place-items-center rounded-full text-4xl"
            aria-hidden="true"
            >🎉</span
          >
          <h2 class="text-neutral mt-7 text-center text-4xl font-black">
            Confirme sua entrada
          </h2>
          <app-text-field
            label="Como devemos te chamar?"
            placeholder="Seu nome completo"
            autocomplete="name"
            hostClass="mt-8"
            [(value)]="participantName"
            (committed)="lastCommittedName.set($event)"
          />
          <p class="mt-4 text-sm leading-6 font-medium text-neutral-400">
            Seu acesso é seguro e privado. Você verá apenas sua própria
            revelação.
          </p>
          <button
            type="button"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 focus:ring-primary-300 mt-7 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition focus:ring-2 focus:outline-none active:scale-[0.98]"
            (click)="joinGroup()"
          >
            {{ joinLabel() }}
          </button>
        </form>
      </section>
    </app-desktop-layout>
  `,
})
export class JoinPage {
  readonly inviteToken = input.required<string>();
  private readonly router = inject(Router);
  readonly joinLabel = signal<string>('Entrar no grupo →');
  readonly participantName = model<string>('');
  readonly lastCommittedName = signal<string>('');

  joinGroup(): void {
    this.joinLabel.set('Entrada confirmada ✓');
    setTimeout(() => void this.router.navigateByUrl('/revelar/demo'), 450);
  }
}
