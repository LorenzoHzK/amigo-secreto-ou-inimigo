import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SUPABASE_URL } from '../tokens/supabase.tokens';
import { DrawResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DrawService {
  private readonly http = inject(HttpClient);
  private readonly supabaseUrl = inject(SUPABASE_URL).replace(/\/$/, '');

  async draw(adminToken: string): Promise<DrawResponse> {
    return firstValueFrom(
      this.http.post<DrawResponse>(
        `${this.supabaseUrl}/functions/v1/perform-draw`,
        { admin_token: adminToken },
      ),
    );
  }
}
