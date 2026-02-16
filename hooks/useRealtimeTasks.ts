// hooks/useRealtimeTasks.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Sua config do Supabase

export function useRealtimeTasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // 1. Carregamento inicial (Fetch)
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*');
      if (data) setTasks(data);
    };
    fetchTasks();

    // 2. Inscrição no Canal Realtime (O "pulo do gato")
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) => prev.map(t => t.id === payload.new.id ? payload.new : t));
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { tasks, setTasks };
}