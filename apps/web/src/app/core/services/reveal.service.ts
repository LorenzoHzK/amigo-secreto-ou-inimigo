import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MyDrawResult, MyParticipationResult } from '../models';
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

  // Leitura pura — não marca revealed_at. Usada para listar/contextualizar.
  async getMyParticipation(
    personalToken: string,
  ): Promise<MyParticipationResult | null> {
    return firstValueFrom(
      this.supabase.rpc<MyParticipationResult>('get_my_participation', {
        p_personal_token: personalToken,
      }),
    );
  }

  // Marca explicitamente o momento da revelação (clique em "Revelar").
  async markRevealed(personalToken: string): Promise<void> {
    await firstValueFrom(
      this.supabase.rpc<null>('mark_revealed', {
        p_personal_token: personalToken,
      }),
    );
  }
}
