import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../tokens/supabase.tokens';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseUrl = inject(SUPABASE_URL);
  const supabaseAnonKey = inject(SUPABASE_ANON_KEY);

  if (!req.url.startsWith(supabaseUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.accessToken();
  const headers = req.headers
    .set('apikey', supabaseAnonKey)
    .set('Authorization', `Bearer ${token ?? supabaseAnonKey}`);

  return next(req.clone({ headers }));
};
