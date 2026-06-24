import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Group } from '../models';
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

  async createGroup(name: string, priceLimit: number | null): Promise<Group> {
    const newGroup = {
      id: crypto.randomUUID(),
      name,
      admin_token: crypto.randomUUID(),
      invite_token: crypto.randomUUID(),
      price_limit: priceLimit,
      drawn_at: null,
      created_at: new Date().toISOString(),
    } satisfies Omit<Group, 'owner_id'>;

    return firstValueFrom(this.supabase.insertOne<Group>(this.table, newGroup));
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
