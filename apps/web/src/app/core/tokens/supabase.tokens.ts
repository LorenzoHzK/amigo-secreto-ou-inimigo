import { InjectionToken } from '@angular/core';

export const SUPABASE_URL = new InjectionToken<string>('SUPABASE_URL', {
  providedIn: 'root',
  factory: () => {
    throw new Error('SUPABASE_URL não foi providenciado. Configure em app.config.ts.');
  },
});

export const SUPABASE_ANON_KEY = new InjectionToken<string>('SUPABASE_ANON_KEY', {
  providedIn: 'root',
  factory: () => {
    throw new Error('SUPABASE_ANON_KEY não foi providenciado. Configure em app.config.ts.');
  },
});
