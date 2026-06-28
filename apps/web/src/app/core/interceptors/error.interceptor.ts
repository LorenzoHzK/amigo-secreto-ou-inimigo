import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../services/api-error.service';
import { AuthService } from '../services/auth.service';

interface ErrorBody {
  message?: unknown; // PostgREST
  error?: unknown; // Edge Functions
  msg?: unknown; // GoTrue
  error_description?: unknown; // GoTrue
  error_code?: unknown; // GoTrue (novo)
  code?: unknown; // GoTrue/PostgREST
}

function getAuthMessage(error: HttpErrorResponse, body: ErrorBody): string | null {
  const code =
    (typeof body.error_code === 'string' && body.error_code) ||
    (typeof body.code === 'string' && body.code) ||
    '';
  const text =
    [body.msg, body.error_description, body.message, body.error]
      .find((v): v is string => typeof v === 'string' && v.trim().length > 0)
      ?.toLowerCase() ?? '';

  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    text.includes('already registered') ||
    text.includes('already been registered')
  ) {
    return 'Este e-mail já está cadastrado. Faça login.';
  }
  if (
    code === 'weak_password' ||
    text.includes('password should be') ||
    text.includes('weak password')
  ) {
    return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
  }
  if (
    code === 'invalid_credentials' ||
    text.includes('invalid login') ||
    text.includes('invalid credentials')
  ) {
    return 'E-mail ou senha inválidos.';
  }
  if (code === 'email_not_confirmed' || text.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }
  if (error.status === 429 || code.includes('rate_limit')) {
    return 'Muitas tentativas. Aguarde alguns instantes e tente de novo.';
  }
  if (error.status === 422) {
    return 'Este e-mail já está cadastrado. Faça login.';
  }
  if (error.status === 400) {
    return 'E-mail ou senha inválidos.';
  }
  return null;
}

function getFriendlyMessage(error: HttpErrorResponse): string {
  const body: ErrorBody =
    error.error && typeof error.error === 'object'
      ? (error.error as ErrorBody)
      : {};

  // Erros de autenticação (GoTrue, /auth/v1/*) têm mensagens dedicadas.
  if (error.url?.includes('/auth/v1/')) {
    const authMessage = getAuthMessage(error, body);
    if (authMessage) {
      return authMessage;
    }
  }

  // Edge Functions retornam { error: "mensagem amigável em pt-BR" }.
  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error;
  }
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  // Erros do PostgREST ({ message, details, hint, code }) NÃO são expostos
  // ao usuário para não vazar detalhes de schema — apenas logados no console.
  if (error.status === 0) {
    return 'Não foi possível conectar ao Supabase.';
  }
  if (error.status === 401) {
    return 'Sessão expirada. Faça login novamente.';
  }
  if (error.status === 409) {
    return 'Este registro já existe.';
  }

  return 'A operação não pôde ser concluída. Tente novamente.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiError = inject(ApiErrorService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        apiError.report(getFriendlyMessage(error));

        if (error.status === 401) {
          auth.clearSession();
        }
      }

      return throwError(() => error);
    }),
  );
};
