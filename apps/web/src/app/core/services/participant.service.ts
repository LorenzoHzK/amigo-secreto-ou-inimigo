import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Participant, ParticipantPublicView } from '../models';
import { SupabaseRestService } from './supabase-rest.service';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly supabase = inject(SupabaseRestService);
  private readonly table = 'participants';
  private readonly publicView = 'participants_public';

  async getParticipantsByGroupId(
    groupId: string,
  ): Promise<ParticipantPublicView[]> {
    return firstValueFrom(
      this.supabase.select<ParticipantPublicView>(this.publicView, {
        filters: { group_id: groupId },
        order: 'created_at',
        ascending: true,
      }),
    );
  }

  // INSERT na tabela real com return=minimal: participants tem SELECT
  // revogado para anon/authenticated, então RETURNING falharia. Como o
  // personal_token é construído aqui, retornamos o objeto local.
  async addParticipant(groupId: string, name: string): Promise<Participant> {
    const newParticipant = {
      id: crypto.randomUUID(),
      group_id: groupId,
      name,
      personal_token: crypto.randomUUID(),
      drawn_participant_id: null,
      revealed_at: null,
      created_at: new Date().toISOString(),
      owner_id: null,
    };

    await firstValueFrom(this.supabase.insert(this.table, newParticipant));
    return newParticipant;
  }

  async removeParticipant(participantId: string): Promise<void> {
    await firstValueFrom(
      this.supabase.deleteOne(this.table, { id: participantId }),
    );
  }
}
