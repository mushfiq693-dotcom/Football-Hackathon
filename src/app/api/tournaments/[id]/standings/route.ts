import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tournament_standings')
    .select('*')
    .eq('tournament_id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data);
};
