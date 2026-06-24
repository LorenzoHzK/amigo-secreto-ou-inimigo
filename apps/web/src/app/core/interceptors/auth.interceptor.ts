import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.supabaseUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.accessToken();
  const headers = req.headers
    .set('apikey', environment.supabaseAnonKey)
    .set('Authorization', `Bearer ${token ?? environment.supabaseAnonKey}`);

  return next(req.clone({ headers }));
};
