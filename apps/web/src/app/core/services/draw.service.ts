import { Injectable, inject } from '@angular/core';
import { GroupService } from './group.service';
import { ParticipantService } from './participant.service';
import { Participant } from '../models';

@Injectable({ providedIn: 'root' })
export class DrawService {
  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);

  async draw(groupId: string): Promise<void> {
    const participants =
      await this.participantService.getParticipantsByGroupId(groupId);
    if (participants.length < 3) {
      throw new Error(
        'O grupo precisa de pelo menos 3 participantes para realizar o sorteio.',
      );
    }

    const shuffled = this.generateDerangement(participants);
    if (!shuffled) {
      throw new Error(
        'Não foi possível gerar um sorteio válido. Tente novamente.',
      );
    }

    // Save drawn_participant_id for each participant
    for (let i = 0; i < participants.length; i++) {
      await this.participantService.updateParticipantDrawnId(
        participants[i].id,
        shuffled[i].id,
      );
    }

    // Update group drawn_at
    await this.groupService.updateGroupDrawnAt(
      groupId,
      new Date().toISOString(),
    );
  }

  private generateDerangement(elements: Participant[]): Participant[] | null {
    if (elements.length < 3) return null;

    const shuffle = (array: Participant[]): Participant[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    let attempts = 0;
    while (attempts < 2000) {
      const shuffled = shuffle(elements);
      let valid = true;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].id === shuffled[i].id) {
          valid = false;
          break;
        }
      }
      if (valid) {
        return shuffled;
      }
      attempts++;
    }
    return null;
  }
}
