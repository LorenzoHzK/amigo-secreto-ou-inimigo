import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SUPABASE_URL } from '../tokens/supabase.tokens';

export type SupabaseFilterValue = string | number | boolean | null;

@Injectable({ providedIn: 'root' })
export class SupabaseRestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(SUPABASE_URL).replace(/\/$/, '');

  select<T>(
    table: string,
    options: {
      filters?: Record<string, SupabaseFilterValue>;
      order?: string;
      ascending?: boolean;
      limit?: number;
      columns?: string;
    } = {},
  ): Observable<T[]> {
    let params = new HttpParams().set('select', options.columns ?? '*');

    for (const [field, value] of Object.entries(options.filters ?? {})) {
      if (value === null) {
        params = params.set(field, 'is.null');
        continue;
      }
      params = params.set(field, `eq.${value}`);
    }

    if (options.order) {
      const direction = options.ascending === false ? '.desc' : '.asc';
      params = params.set('order', `${options.order}${direction}`);
    }

    if (typeof options.limit === 'number') {
      params = params.set('limit', String(options.limit));
    }

    return this.http.get<T[]>(`${this.baseUrl}/rest/v1/${table}`, { params });
  }

  selectOne<T>(
    table: string,
    options: {
      filters?: Record<string, SupabaseFilterValue>;
      order?: string;
      ascending?: boolean;
      columns?: string;
    } = {},
  ): Observable<T | null> {
    return this.select<T>(table, { ...options, limit: 1 }).pipe(
      map((rows) => rows[0] ?? null),
    );
  }

  insertOne<T>(table: string, payload: Record<string, unknown>): Observable<T> {
    // Prefer: return=representation garante que o PostgREST devolva a linha
    // inserida — necessário para receber colunas geradas pelo banco
    // (ex.: admin_token/invite_token via DEFAULT gen_random_uuid()).
    return this.http
      .post<T[]>(`${this.baseUrl}/rest/v1/${table}`, payload, {
        params: new HttpParams().set('select', '*'),
        headers: new HttpHeaders({ Prefer: 'return=representation' }),
      })
      .pipe(map((rows) => rows[0]));
  }

  updateOne<T>(
    table: string,
    filters: Record<string, SupabaseFilterValue>,
    payload: Record<string, unknown>,
  ): Observable<T> {
    let params = new HttpParams().set('select', '*');
    for (const [field, value] of Object.entries(filters)) {
      if (value === null) {
        params = params.set(field, 'is.null');
        continue;
      }
      params = params.set(field, `eq.${value}`);
    }

    return this.http
      .patch<T[]>(`${this.baseUrl}/rest/v1/${table}`, payload, { params })
      .pipe(map((rows) => rows[0]));
  }

  deleteOne(
    table: string,
    filters: Record<string, SupabaseFilterValue>,
  ): Observable<void> {
    let params = new HttpParams();
    for (const [field, value] of Object.entries(filters)) {
      if (value === null) {
        params = params.set(field, 'is.null');
        continue;
      }
      params = params.set(field, `eq.${value}`);
    }

    return this.http.delete<void>(`${this.baseUrl}/rest/v1/${table}`, { params });
  }

  rpc<T>(functionName: string, params: Record<string, unknown>): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/rest/v1/rpc/${functionName}`,
      params,
    );
  }
}
