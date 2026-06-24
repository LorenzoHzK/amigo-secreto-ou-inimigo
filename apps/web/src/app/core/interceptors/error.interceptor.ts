import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../services/api-error.service';
import { AuthService } from '../services/auth.service';

function getFriendlyMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (error.error?.message && typeof error.error.message === 'string') {
    return error.error.message;
  }

  if (error.status === 0) {
    return 'Não foi possível conectar ao Supabase.';
  }

  if (error.status === 401) {
    return 'Sessão expirada. Faça login novamente.';
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
