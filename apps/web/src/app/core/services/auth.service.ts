import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../tokens/supabase.tokens';

export interface SupabaseUser {
  id: string;
  aud: string;
  email: string | null;
  role?: string;
  confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseUser;
}

interface SignUpResponse {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'amigo-oculto.supabase.session';
  private readonly baseUrl = inject(SUPABASE_URL).replace(/\/$/, '');
  private readonly anonHeaders = new HttpHeaders({
    apikey: inject(SUPABASE_ANON_KEY),
    'Content-Type': 'application/json',
  });
  private readonly sessionSubject = new BehaviorSubject<SupabaseSession | null>(
    this.readSession(),
  );

  readonly session = toSignal(this.sessionSubject.asObservable(), {
    initialValue: this.readSession(),
  });
  readonly session$ = this.sessionSubject.asObservable();
  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.session()?.access_token));
  readonly accessToken = computed(() => this.session()?.access_token ?? null);
  readonly accessToken$ = toObservable(this.accessToken);

  constructor() {
    effect(() => {
      const session = this.session();
      if (session) {
        localStorage.setItem(this.storageKey, JSON.stringify(session));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    });
  }

  private authUrl(path: string): string {
    return `${this.baseUrl}/auth/v1/${path}`;
  }

  private readSession(): SupabaseSession | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as SupabaseSession) : null;
    } catch {
      return null;
    }
  }

  private setSession(session: SupabaseSession | null): void {
    this.sessionSubject.next(session);
  }

  async signIn(email: string, password: string): Promise<SupabaseSession> {
    const session = await firstValueFrom(
      this.http.post<SupabaseSession>(
        this.authUrl('token?grant_type=password'),
        { email, password },
        { headers: this.anonHeaders },
      ),
    );

    this.setSession(session);
    return session;
  }

  async signUp(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<SignUpResponse> {
    const response = await firstValueFrom(
      this.http.post<SignUpResponse>(
        this.authUrl('signup'),
        {
          email,
          password,
          options: {
            data: displayName ? { display_name: displayName } : undefined,
          },
        },
        { headers: this.anonHeaders },
      ),
    );

    if (response.session) {
      this.setSession(response.session);
    }

    return response;
  }

  async signOut(): Promise<void> {
    const token = this.accessToken();
    try {
      if (token) {
        await firstValueFrom(
          this.http.post<void>(
            this.authUrl('logout'),
            {},
            {
              headers: this.anonHeaders.set('Authorization', `Bearer ${token}`),
            },
          ),
        );
      }
    } catch {
      // Ignore remote logout errors and clear the local session anyway.
    } finally {
      this.setSession(null);
    }
  }

  clearSession(): void {
    this.setSession(null);
  }
}
