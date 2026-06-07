import { Injectable } from '@angular/core';
import { Participant } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly baseUrl = `${environment.apiUrl}/participants`;

  async getParticipantsByGroupId(groupId: string): Promise<Participant[]> {
    const response = await fetch(`${this.baseUrl}?group_id=${groupId}`);
    return response.json();
  }

  async getParticipantByPersonalToken(
    token: string,
  ): Promise<Participant | null> {
    const response = await fetch(`${this.baseUrl}?personal_token=${token}`);
    const participants: Participant[] = await response.json();
    return participants.length > 0 ? participants[0] : null;
  }

  async getParticipantById(id: string): Promise<Participant | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async addParticipant(groupId: string, name: string): Promise<Participant> {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      group_id: groupId,
      name,
      personal_token: crypto.randomUUID(),
      drawn_participant_id: null,
      created_at: new Date().toISOString(),
    };
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newParticipant),
    });
    return response.json();
  }

  async removeParticipant(participantId: string): Promise<void> {
    await fetch(`${this.baseUrl}/${participantId}`, {
      method: 'DELETE',
    });
  }

  async updateParticipantDrawnId(
    participantId: string,
    drawnParticipantId: string | null,
  ): Promise<Participant> {
    const response = await fetch(`${this.baseUrl}/${participantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drawn_participant_id: drawnParticipantId }),
    });
    return response.json();
  }
}
