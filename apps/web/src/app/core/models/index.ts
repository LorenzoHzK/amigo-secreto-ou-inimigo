// ===== ENTIDADE: GROUP =====

export type GroupStatus = 'open' | 'drawn' | 'archived';

export interface Group {
  id: string;
  name: string;
  admin_token: string;
  invite_token: string;
  price_limit: number | null;
  reveal_date: string | null;
  status: GroupStatus;
  drawn_at: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string | null;
  join_password_hash?: string | null;
}

// Payload para criação — campos que o cliente envia
export type CreateGroupPayload = {
  name: string;
  price_limit: number | null;
  reveal_date: string | null;
  owner_id?: string | null;
};

// Visão pública do grupo (sem admin_token). has_join_password indica se o
// grupo exige senha para entrar, sem nunca expor o hash da senha.
export type GroupPublicView = Pick<
  Group,
  'id' | 'name' | 'price_limit' | 'reveal_date' | 'status' | 'drawn_at'
> & { has_join_password?: boolean };

// ===== ENTIDADE: PARTICIPANT =====

export interface Participant {
  id: string;
  group_id: string;
  name: string;
  personal_token: string;
  drawn_participant_id: string | null;
  revealed_at: string | null;
  created_at: string;
  owner_id: string | null;
  claimed_at: string | null;
}

// Payload para entrar no grupo
export type JoinGroupPayload = {
  group_id: string;
  name: string;
};

// Visão pública de participante (sem drawn_participant_id nem personal_token).
// claimed_at indica se a pessoa já reivindicou o seu lugar pelo link.
export type ParticipantPublicView = Pick<
  Participant,
  'id' | 'name' | 'created_at' | 'claimed_at'
>;

// Resultado da RPC claim_participant
export interface ClaimResult {
  status:
    | 'ok'
    | 'wrong_password'
    | 'already_claimed'
    | 'not_found'
    | 'group_unavailable';
  personal_token?: string;
}

// ===== RESULTADO DA RPC get_my_draw =====

export interface MyDrawResult {
  participant: { id: string; name: string };
  group: GroupPublicView;
  drawn: { id: string; name: string } | null;
}

// Resultado da RPC get_my_participation (leitura pura, sem o par sorteado)
export interface MyParticipationResult {
  participant: { id: string; name: string };
  group: GroupPublicView;
}

// ===== CONTEXTOS DE TOKEN =====

export interface AdminTokenContext {
  groupId: string;
  adminToken: string;
}

export interface ParticipantTokenContext {
  groupId: string;
  personalToken: string;
}

// ===== RESULTADO DO SORTEIO (Edge Function) =====

export interface DrawResponse {
  drawn_at: string;
  participant_count: number;
  group_name: string;
}
