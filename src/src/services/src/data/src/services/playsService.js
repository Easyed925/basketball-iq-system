import { supabase } from './supabaseClient';

export async function savePlay(userId, play) {
  const { data, error } = await supabase
    .from('plays')
    .insert([
      {
        user_id: userId,
        name: play.name,
        description: play.description,
        canvas_image: play.canvasImage,
        play_data: play.data,
        tags: play.tags || [],
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function loadPlays(userId) {
  const { data, error } = await supabase
    .from('plays')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deletePlay(playId) {
  const { error } = await supabase
    .from('plays')
    .delete()
    .eq('id', playId);

  if (error) throw error;
}

export async function updatePlay(playId, updates) {
  const { data, error } = await supabase
    .from('plays')
    .update(updates)
    .eq('id', playId)
    .select();

  if (error) throw error;
  return data[0];
}
