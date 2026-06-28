import {
  ApplicationConfig,
  isDevMode,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './core/tokens/supabase.tokens';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    { provide: SUPABASE_URL,      useValue: environment.supabaseUrl },
    { provide: SUPABASE_ANON_KEY, useValue: environment.supabaseAnonKey },
    // PWA: registra o service worker gerado pelo Angular (ngsw-worker.js).
    // Ativo apenas em produção; em dev (ng serve) fica desligado.
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
