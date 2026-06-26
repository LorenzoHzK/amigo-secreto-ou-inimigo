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

  // INSERT ainda usa a tabela real
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

    return firstValueFrom(
      this.supabase.insertOne<Participant>(this.table, newParticipant),
    );
  }

  async removeParticipant(participantId: string): Promise<void> {
    await firstValueFrom(
      this.supabase.deleteOne(this.table, { id: participantId }),
    );
  }
}
