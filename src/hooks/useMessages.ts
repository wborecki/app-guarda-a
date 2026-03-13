import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Conversation {
  id: string;
  reservation_id: string | null;
  participant_a: string;
  participant_b: string;
  last_message_at: string;
  created_at: string;
  // Joined data
  other_name: string;
  last_message_text: string;
  unread_count: number;
  reservation_notes: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: convs, error } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (error || !convs) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
      return;
    }

    // For each conversation, get last message, unread count, other user name
    const enriched: Conversation[] = await Promise.all(
      convs.map(async (c: any) => {
        const otherId = c.participant_a === user.id ? c.participant_b : c.participant_a;

        // Get other user's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", otherId)
          .maybeSingle();

        // Get last message
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get unread count
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", c.id)
          .eq("read", false)
          .neq("sender_id", user.id);

        // Get reservation notes
        let reservationNotes: string | null = null;
        if (c.reservation_id) {
          const { data: res } = await supabase
            .from("reservations")
            .select("notes")
            .eq("id", c.reservation_id)
            .maybeSingle();
          reservationNotes = res?.notes || null;
        }

        return {
          ...c,
          other_name: profile?.display_name || "Usuário",
          last_message_text: lastMsg?.content || "",
          unread_count: count || 0,
          reservation_notes: reservationNotes,
        };
      })
    );

    setConversations(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime: refresh on conversation changes
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => fetchConversations()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useChat(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mark messages as read
  useEffect(() => {
    if (!conversationId || !user) return;
    supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .eq("read", false)
      .neq("sender_id", user.id)
      .then();
  }, [conversationId, user, messages]);

  // Realtime
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Mark as read if not sender
          if (user && newMsg.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", newMsg.id)
              .then();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, user]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !user || !content.trim()) return;
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      });
      if (!error) {
        // Update conversation last_message_at
        await supabase
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
      return error;
    },
    [conversationId, user]
  );

  return { messages, loading, sendMessage };
}

// Create or find a conversation for a reservation
export async function getOrCreateConversation(
  reservationId: string,
  participantA: string,
  participantB: string
): Promise<string | null> {
  // Check existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("reservation_id", reservationId)
    .maybeSingle();

  if (existing) return existing.id;

  // Create new
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      reservation_id: reservationId,
      participant_a: participantA,
      participant_b: participantB,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
  return data.id;
}
