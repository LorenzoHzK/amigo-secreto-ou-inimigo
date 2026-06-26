import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MyDrawResult } from '../models';
import { SupabaseRestService } from './supabase-rest.service';

@Injectable({ providedIn: 'root' })
export class RevealService {
  private readonly supabase = inject(SupabaseRestService);

  async getMyDraw(personalToken: string): Promise<MyDrawResult | null> {
    return firstValueFrom(
      this.supabase.rpc<MyDrawResult>('get_my_draw', {
        p_personal_token: personalToken,
      }),
    );
  }
}
