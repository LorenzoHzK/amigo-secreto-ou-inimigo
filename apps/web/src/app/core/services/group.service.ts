import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Group, CreateGroupPayload, GroupStatus } from '../models';
import { SupabaseRestService } from './supabase-rest.service';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly supabase = inject(SupabaseRestService);
  private readonly table = 'groups';

  async getGroups(): Promise<Group[]> {
    return firstValueFrom(
      this.supabase.select<Group>(this.table, {
        order: 'created_at',
        ascending: false,
      }),
    );
  }

  async getGroupById(id: string): Promise<Group | null> {
    return firstValueFrom(
      this.supabase.selectOne<Group>(this.table, {
        filters: { id },
      }),
    );
  }

  async getGroupByAdminToken(token: string): Promise<Group | null> {
    return firstValueFrom(
      this.supabase.selectOne<Group>(this.table, {
        filters: { admin_token: token },
      }),
    );
  }

  async getGroupByInviteToken(token: string): Promise<Group | null> {
    return firstValueFrom(
      this.supabase.selectOne<Group>(this.table, {
        filters: { invite_token: token },
      }),
    );
  }

  async createGroup(
    payloadOrName: CreateGroupPayload | string,
    priceLimit?: number | null,
  ): Promise<Group> {
    let payload: CreateGroupPayload;
    if (typeof payloadOrName === 'string') {
      payload = {
        name: payloadOrName,
        price_limit: priceLimit ?? null,
        reveal_date: null,
        owner_id: null,
      };
    } else {
      payload = payloadOrName;
    }

    // admin_token e invite_token são gerados pelo banco (DEFAULT gen_random_uuid())
    // e retornam no insert via Prefer: return=representation. Nunca gerar
    // tokens de segurança no cliente.
    const newGroup = {
      id: crypto.randomUUID(),
      name: payload.name,
      price_limit: payload.price_limit,
      reveal_date: payload.reveal_date,
      status: 'open' as const,
      drawn_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: payload.owner_id ?? null,
    };

    return firstValueFrom(this.supabase.insertOne<Group>(this.table, newGroup));
  }

  async getGroupsByOwnerId(ownerId: string): Promise<Group[]> {
    return firstValueFrom(
      this.supabase.select<Group>(this.table, {
        filters: { owner_id: ownerId },
        order: 'created_at',
        ascending: false,
      }),
    );
  }

  async updateGroupStatus(id: string, status: GroupStatus): Promise<Group> {
    return firstValueFrom(
      this.supabase.updateOne<Group>(this.table, { id }, { status }),
    );
  }

  async updateGroupPriceLimit(
    id: string,
    priceLimit: number | null,
  ): Promise<Group> {
    return firstValueFrom(
      this.supabase.updateOne<Group>(
        this.table,
        { id },
        { price_limit: priceLimit },
      ),
    );
  }

  async updateGroupDrawnAt(id: string, drawnAt: string | null): Promise<Group> {
    return firstValueFrom(
      this.supabase.updateOne<Group>(this.table, { id }, { drawn_at: drawnAt }),
    );
  }
}
