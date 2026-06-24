import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex min-h-dvh max-w-md items-center px-5 py-10">
      <form
        class="w-full rounded-[2rem] border border-[#ececf3] bg-white p-7 shadow-[0_24px_70px_rgba(26,26,46,0.08)]"
        [formGroup]="form"
        (ngSubmit)="submit()"
      >
        <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Acesso Seguro</p>
        <h1 class="text-neutral mt-4 text-4xl leading-tight font-black">Entrar na conta</h1>
        <p class="mt-3 text-sm leading-6 font-medium text-neutral-400">
          Use sua conta Supabase para acessar as áreas privadas do projeto.
        </p>

        <label class="mt-7 block">
          <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Email</span>
          <input
            type="email"
            formControlName="email"
            autocomplete="email"
            class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
            placeholder="voce@exemplo.com"
          />
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <p class="mt-2 text-xs font-bold text-error">Informe um email válido.</p>
          }
        </label>

        <label class="mt-5 block">
          <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">Senha</span>
          <input
            type="password"
            formControlName="password"
            autocomplete="current-password"
            class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
            placeholder="Sua senha"
          />
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <p class="mt-2 text-xs font-bold text-error">A senha precisa ter pelo menos 6 caracteres.</p>
          }
        </label>

        <button
          type="submit"
          [disabled]="form.invalid || isSubmitting()"
          class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-7 w-full rounded-full px-8 py-4 text-base font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ buttonLabel() }}
        </button>

        <p class="mt-5 text-center text-sm font-medium text-neutral-500">
          Não tem conta?
          <a routerLink="/registrar" class="text-primary font-black">Criar cadastro</a>
        </p>
      </form>
    </section>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly buttonLabel = signal('Entrar');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.buttonLabel.set('Entrando...');

    try {
      await this.auth.signIn(
        this.form.controls.email.value.trim(),
        this.form.controls.password.value,
      );
      await this.router.navigateByUrl('/grupos');
    } catch {
      this.buttonLabel.set('Tente novamente');
    } finally {
      this.isSubmitting.set(false);
      if (this.buttonLabel() !== 'Entrar') {
        setTimeout(() => this.buttonLabel.set('Entrar'), 2200);
      }
    }
  }
}
