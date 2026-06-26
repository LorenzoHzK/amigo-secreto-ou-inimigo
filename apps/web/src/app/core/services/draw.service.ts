import { Injectable, inject } from '@angular/core';
import { GroupService } from './group.service';
import { ParticipantService } from './participant.service';
import { Participant } from '../models';

@Injectable({ providedIn: 'root' })
export class DrawService {
  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);

  async draw(groupId: string): Promise<void> {
    throw new Error('Not implemented. Refactoring in progress.');
  }
}
