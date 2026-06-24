import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Participant } from '../models';
import { SupabaseRestService } from './supabase-rest.service';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly supabase = inject(SupabaseRestService);
  private readonly table = 'participants';

  async getParticipantsByGroupId(groupId: string): Promise<Participant[]> {
    return firstValueFrom(
      this.supabase.select<Participant>(this.table, {
        filters: { group_id: groupId },
        order: 'created_at',
        ascending: true,
      }),
    );
  }

  async getParticipantByPersonalToken(
    token: string,
  ): Promise<Participant | null> {
    return firstValueFrom(
      this.supabase.selectOne<Participant>(this.table, {
        filters: { personal_token: token },
      }),
    );
  }

  async getParticipantById(id: string): Promise<Participant | null> {
    return firstValueFrom(
      this.supabase.selectOne<Participant>(this.table, {
        filters: { id },
      }),
    );
  }

  async addParticipant(groupId: string, name: string): Promise<Participant> {
    const newParticipant = {
      id: crypto.randomUUID(),
      group_id: groupId,
      name,
      personal_token: crypto.randomUUID(),
      drawn_participant_id: null,
      created_at: new Date().toISOString(),
    } satisfies Omit<Participant, 'owner_id'>;

    return firstValueFrom(
      this.supabase.insertOne<Participant>(this.table, newParticipant),
    );
  }

  async removeParticipant(participantId: string): Promise<void> {
    await firstValueFrom(
      this.supabase.deleteOne(this.table, { id: participantId }),
    );
  }

  async updateParticipantDrawnId(
    participantId: string,
    drawnParticipantId: string | null,
  ): Promise<Participant> {
    return firstValueFrom(
      this.supabase.updateOne<Participant>(
        this.table,
        { id: participantId },
        { drawn_participant_id: drawnParticipantId },
      ),
    );
  }
}
