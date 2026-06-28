import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Group, CreateGroupPayload, GroupPublicView } from '../models';
import { SupabaseRestService } from './supabase-rest.service';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly supabase = inject(SupabaseRestService);
  private readonly table = 'groups';

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

  // Visão pública por invite_token (inclui has_join_password, sem admin_token).
  // Usada na tela de entrada para decidir se pede senha.
  async getPublicGroupByInviteToken(
    token: string,
  ): Promise<GroupPublicView | null> {
    return firstValueFrom(
      this.supabase.selectOne<GroupPublicView>('groups_public', {
        filters: { invite_token: token },
      }),
    );
  }

  // Define/altera/limpa a senha do grupo (autorizado pelo admin_token).
  // Senha vazia remove a proteção. Retorna true se o grupo foi encontrado.
  async setGroupPassword(
    adminToken: string,
    password: string,
  ): Promise<boolean> {
    return firstValueFrom(
      this.supabase.rpc<boolean>('set_group_password', {
        p_admin_token: adminToken,
        p_password: password,
      }),
    );
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

  async createGroup(payload: CreateGroupPayload): Promise<Group> {
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
}
