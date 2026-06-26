import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DesktopLayoutComponent } from '../../shared/layouts/desktop-layout/desktop-layout.component';
import { MobileShellComponent } from '../../shared/components/mobile-shell/mobile-shell.component';
import { GroupService } from '../../core/services/group.service';

@Component({
  selector: 'app-create-group-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MobileShellComponent, DesktopLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-mobile-shell innerClass="bg-base-200">
      <main class="flex min-h-dvh flex-1 flex-col justify-center px-6 py-8">
        <section class="rounded-[2rem] bg-white p-6 shadow-[0_16px_40px_rgba(26,26,46,0.06)]">
          <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Novo grupo</p>
          <h1 class="text-neutral mt-3 text-4xl leading-tight font-black">Criar uma nova troca</h1>
          <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">Defina o nome e o limite de preço. O Supabase guarda o grupo e os tokens de convite.</p>

          <form class="mt-7 space-y-5" [formGroup]="form" (ngSubmit)="createGroup()">
            <label class="block">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Nome do grupo</span>
              <input
                type="text"
                formControlName="name"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                placeholder="Ex: Natal em Família 2024"
              />
              @if (form.controls.name.touched && form.controls.name.invalid) {
                <p class="mt-2 text-xs font-bold text-error">Informe um nome com pelo menos 3 caracteres.</p>
              }
            </label>

            <label class="block">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Limite de preço</span>
              <input
                type="text"
                formControlName="priceLimit"
                inputmode="decimal"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                placeholder="0,00"
              />
              @if (form.controls.priceLimit.touched && form.controls.priceLimit.invalid) {
                <p class="mt-2 text-xs font-bold text-error">Use apenas números e decimal opcional, como 50 ou 50,00.</p>
              }
            </label>

            <label class="block">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">
                Data de revelação (opcional)
              </span>
              <input
                type="date"
                formControlName="revealDate"
                [min]="today()"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
              />
            </label>

            <button
              type="submit"
              [disabled]="form.invalid || isSubmitting()"
              class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-2 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ buttonLabel() }}
            </button>
          </form>
        </section>
      </main>
    </app-mobile-shell>

    <app-desktop-layout>
      <section class="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-2xl items-center justify-center px-6 py-12">
        <form class="w-full rounded-[2rem] border border-[#ececf3] bg-white p-8 shadow-[0_24px_70px_rgba(26,26,46,0.08)]" [formGroup]="form" (ngSubmit)="createGroup()">
          <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Novo grupo</p>
          <h1 class="text-neutral mt-4 text-5xl leading-tight font-black">Criar uma nova troca</h1>
          <p class="mt-3 max-w-xl text-sm leading-6 font-medium text-neutral-400">Configure o nome, defina o limite e publique o grupo no Supabase.</p>

          <div class="mt-8 grid gap-5 md:grid-cols-2">
            <label class="block md:col-span-2">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Nome do grupo</span>
              <input
                type="text"
                formControlName="name"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                placeholder="Ex: Natal em Família 2024"
              />
              @if (form.controls.name.touched && form.controls.name.invalid) {
                <p class="mt-2 text-xs font-bold text-error">Informe um nome com pelo menos 3 caracteres.</p>
              }
            </label>

            <label class="block md:col-span-2">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Limite de preço</span>
              <input
                type="text"
                formControlName="priceLimit"
                inputmode="decimal"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
                placeholder="0,00"
              />
              @if (form.controls.priceLimit.touched && form.controls.priceLimit.invalid) {
                <p class="mt-2 text-xs font-bold text-error">Use apenas números e decimal opcional, como 50 ou 50,00.</p>
              }
            </label>

            <label class="block md:col-span-2">
              <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">
                Data de revelação (opcional)
              </span>
              <input
                type="date"
                formControlName="revealDate"
                [min]="today()"
                class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
              />
            </label>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || isSubmitting()"
            class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-8 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ buttonLabel() }}
          </button>
        </form>
      </section>
    </app-desktop-layout>
  `,
})
export class CreateGroupPage {
  private readonly router = inject(Router);
  private readonly groupService = inject(GroupService);
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly buttonLabel = signal('Criar grupo 🎉');
  readonly today = signal(new Date().toISOString().split('T')[0]);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    priceLimit: ['', [Validators.pattern(/^\d+(?:[.,]\d{1,2})?$/)]],
    revealDate: [''],
  });

  async createGroup(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.controls.name.value.trim();
    const rawPrice = this.form.controls.priceLimit.value.trim();
    const parsedPrice = rawPrice ? Number.parseFloat(rawPrice.replace(',', '.')) : null;
    const price = parsedPrice !== null && Number.isFinite(parsedPrice) ? parsedPrice : null;

    const revealDateRaw = this.form.controls.revealDate.value;
    const revealDate = revealDateRaw ? new Date(revealDateRaw).toISOString() : null;

    this.isSubmitting.set(true);
    this.buttonLabel.set('Criando...');

    try {
      const group = await this.groupService.createGroup({
        name,
        price_limit: price,
        reveal_date: revealDate,
      });

      const storedAdmin = this.readTokenList('my_admin_tokens');
      if (!storedAdmin.includes(group.admin_token)) {
        storedAdmin.push(group.admin_token);
        localStorage.setItem('my_admin_tokens', JSON.stringify(storedAdmin));
      }

      this.buttonLabel.set('Grupo criado ✓');
      setTimeout(() => void this.router.navigateByUrl(`/admin/${group.admin_token}`), 400);
    } catch (error) {
      console.error(error);
      this.buttonLabel.set('Erro ao criar');
      setTimeout(() => this.buttonLabel.set('Criar grupo 🎉'), 2200);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private readTokenList(key: string): string[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]') as string[];
    } catch {
      return [];
    }
  }
}
