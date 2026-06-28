// Ambiente de PRODUÇÃO (usado pelo `ng build` / deploy na Vercel).
//
// Preencha com os dados do seu projeto Supabase CLOUD:
//   Dashboard → Project Settings → API
//   - supabaseUrl: "Project URL"  (ex.: https://abcdxyz.supabase.co)
//   - supabaseAnonKey: a chave "anon public" (ou "Publishable", sb_publishable_...).
//
// A chave anon/publishable é PÚBLICA por natureza (vai no frontend), então
// pode ser commitada com segurança. NUNCA coloque aqui a service_role/secret.
export const environment = {
  production: true,
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY',
  appName: 'Amigo Secreto ou Inimigo',
};
