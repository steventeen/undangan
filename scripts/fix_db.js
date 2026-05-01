const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fix() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase.rpc('exec_sql', { 
    sql_query: 'ALTER TABLE public.templates ADD CONSTRAINT templates_name_key UNIQUE (name);' 
  });
  if (error) console.error('Fix Error:', error);
  else console.log('Fixed UNIQUE constraint');
}
// fix(); 
// Wait, I don't have exec_sql RPC. 
// I'll just use a direct query if possible, but supabase-js doesn't support raw SQL easily unless there's an RPC.
