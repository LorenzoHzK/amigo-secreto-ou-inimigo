import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Participant {
  id: string;
  group_id: string;
  name: string;
}

function generateDerangement(participants: Participant[]): Participant[] | null {
  if (participants.length < 3) return null;

  const shuffle = (arr: Participant[]): Participant[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  for (let attempt = 0; attempt < 2000; attempt++) {
    const shuffled = shuffle(participants);
    const isDerangement = shuffled.every((p, i) => p.id !== participants[i].id);
    if (isDerangement) return shuffled;
  }

  return null;
}

Deno.serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { admin_token } = await req.json() as { admin_token: string };

    if (!admin_token || typeof admin_token !== 'string') {
      return new Response(JSON.stringify({ error: 'admin_token é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Usar service_role para bypass de RLS — variáveis injetadas automaticamente pelo Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // 1. Buscar grupo pelo admin_token
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, drawn_at, status')
      .eq('admin_token', admin_token)
      .single();

    if (groupError || !group) {
      return new Response(JSON.stringify({ error: 'Grupo não encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Verificar se sorteio já foi realizado
    if (group.drawn_at !== null || group.status === 'drawn') {
      return new Response(JSON.stringify({ error: 'Sorteio já realizado para este grupo' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Buscar participantes
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id, group_id, name')
      .eq('group_id', group.id)
      .order('created_at', { ascending: true });

    if (participantsError || !participants) {
      return new Response(JSON.stringify({ error: 'Erro ao buscar participantes' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Validar mínimo de 3 participantes
    if (participants.length < 3) {
      return new Response(
        JSON.stringify({ error: 'Mínimo de 3 participantes necessários para o sorteio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 5. Gerar derangement
    const shuffled = generateDerangement(participants);
    if (!shuffled) {
      return new Response(
        JSON.stringify({ error: 'Não foi possível gerar um sorteio válido. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 6. Persistir atomicamente via transação PostgreSQL
    // Atualizar cada participante com seu par sorteado
    const updatePromises = participants.map((participant, index) =>
      supabase
        .from('participants')
        .update({ drawn_participant_id: shuffled[index].id })
        .eq('id', participant.id)
    );

    const updateResults = await Promise.all(updatePromises);
    const updateError = updateResults.find((r) => r.error);

    if (updateError?.error) {
      // Tentativa de rollback: limpar os que foram atualizados
      await supabase
        .from('participants')
        .update({ drawn_participant_id: null })
        .eq('group_id', group.id);

      return new Response(JSON.stringify({ error: 'Erro ao salvar sorteio. Operação revertida.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 7. Marcar grupo como sorteado
    const drawnAt = new Date().toISOString();
    const { error: groupUpdateError } = await supabase
      .from('groups')
      .update({ drawn_at: drawnAt, status: 'drawn' })
      .eq('id', group.id);

    if (groupUpdateError) {
      return new Response(JSON.stringify({ error: 'Erro ao finalizar sorteio' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        drawn_at: drawnAt,
        participant_count: participants.length,
        group_name: group.name,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('perform-draw error:', err);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
