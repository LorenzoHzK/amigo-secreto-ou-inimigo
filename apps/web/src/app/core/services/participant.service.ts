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
      claimed_at: null,
    };

    await firstValueFrom(this.supabase.insert(this.table, newParticipant));
    return newParticipant;
  }

  // Remoção via RPC SECURITY DEFINER: um DELETE direto falharia (participants
  // tem SELECT revogado, exigido para ler id/group_id no DELETE+RLS). A RPC
  // só remove se o chamador for o dono do grupo e o sorteio não tiver ocorrido.
  // Retorna true se removeu.
  async removeParticipant(participantId: string): Promise<boolean> {
    return firstValueFrom(
      this.supabase.rpc<boolean>('remove_participant', {
        p_participant_id: participantId,
      }),
    );
  }
}
