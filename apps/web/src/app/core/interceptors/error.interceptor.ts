import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../services/api-error.service';
import { AuthService } from '../services/auth.service';

function getFriendlyMessage(error: HttpErrorResponse): string {
  const body: unknown = error.error;

  // Edge Functions retornam { error: "mensagem amigável em pt-BR" }.
  if (
    body &&
    typeof body === 'object' &&
    'error' in body &&
    typeof (body as { error: unknown }).error === 'string' &&
    (body as { error: string }).error.trim()
  ) {
    return (body as { error: string }).error;
  }

  if (typeof body === 'string' && body.trim()) {
    return body;
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
