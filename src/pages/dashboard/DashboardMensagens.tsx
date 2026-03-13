import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, ArrowLeft, User, Clock } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations, useChat } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Helpers ───────────────────────────────────────────────────────
function formatMessageTime(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return "Ontem " + format(d, "HH:mm");
  return format(d, "dd/MM HH:mm", { locale: ptBR });
}

function formatConversationTime(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return "Ontem";
  return format(d, "dd/MM", { locale: ptBR });
}

function groupMessagesByDate(messages: { created_at: string }[]) {
  const groups: { label: string; messages: typeof messages }[] = [];
  let current = "";
  messages.forEach((m) => {
    const d = new Date(m.created_at);
    let label: string;
    if (isToday(d)) label = "Hoje";
    else if (isYesterday(d)) label = "Ontem";
    else label = format(d, "dd 'de' MMMM", { locale: ptBR });
    if (label !== current) {
      current = label;
      groups.push({ label, messages: [] });
    }
    groups[groups.length - 1].messages.push(m);
  });
  return groups;
}

// ─── Conversation List ─────────────────────────────────────────────
function ConversationList({
  conversations,
  loading,
  selectedId,
  onSelect,
}: {
  conversations: ReturnType<typeof useConversations>["conversations"];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Nenhuma conversa"
        description="Suas conversas com anfitriões e locatários aparecerão aqui após uma reserva."
        actionLabel="Buscar espaço"
        actionHref="/buscar"
      />
    );
  }

  return (
    <div className="divide-y divide-border/40">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 ${
            selectedId === conv.id ? "bg-primary/5 border-l-2 border-primary" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground truncate">
                {conv.other_name}
              </span>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                {formatConversationTime(conv.last_message_at)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-xs text-muted-foreground truncate">
                {conv.last_message_text || (conv.reservation_notes ? conv.reservation_notes.slice(0, 50) : "Nova conversa")}
              </p>
              {conv.unread_count > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {conv.unread_count > 9 ? "9+" : conv.unread_count}
                </span>
              )}
            </div>
            {conv.reservation_notes && (
              <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">
                {conv.reservation_notes.slice(0, 60)}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Chat View ─────────────────────────────────────────────────────
function ChatView({
  conversationId,
  otherName,
  reservationNotes,
  onBack,
}: {
  conversationId: string;
  otherName: string;
  reservationNotes: string | null;
  onBack?: () => void;
}) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(conversationId);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const err = await sendMessage(input);
    if (!err) setInput("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm flex-shrink-0">
        {onBack && (
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft size={18} className="text-muted-foreground" />
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{otherName}</p>
          {reservationNotes && (
            <p className="text-[10px] text-muted-foreground truncate">{reservationNotes.slice(0, 50)}</p>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Skeleton className="w-48 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground py-12">
            <MessageSquare size={32} className="text-muted-foreground/30" />
            <p className="text-sm">Nenhuma mensagem ainda</p>
            <p className="text-xs text-muted-foreground/60">Envie a primeira mensagem para iniciar a conversa.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div className="flex justify-center mb-3">
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary/80 rounded-full px-3 py-0.5">
                  {group.label}
                </span>
              </div>
              <div className="space-y-1.5">
                {group.messages.map((msg: any) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className={`flex items-center justify-end gap-1 mt-0.5 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground/60"}`}>
                          <Clock size={9} />
                          <span className="text-[9px]">{format(new Date(msg.created_at), "HH:mm")}</span>
                          {isMine && msg.read && (
                            <span className="text-[9px] ml-0.5">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-card/80 backdrop-blur-sm px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-secondary/50 border-border/40 text-sm"
          disabled={sending}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
const DashboardMensagens = () => {
  const { conversations, loading } = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const selectedConv = conversations.find((c) => c.id === selectedId);

  // Mobile: show list or chat, not both
  if (isMobile) {
    if (selectedId && selectedConv) {
      return (
        <div className="w-full h-[calc(100vh-120px)] flex flex-col">
          <ChatView
            conversationId={selectedId}
            otherName={selectedConv.other_name}
            reservationNotes={selectedConv.reservation_notes}
            onBack={() => setSelectedId(null)}
          />
        </div>
      );
    }

    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-0.5">Mensagens</h1>
          <p className="text-muted-foreground text-sm">Conversas com anfitriões e locatários.</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <ConversationList
            conversations={conversations}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    );
  }

  // Desktop: side-by-side
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Mensagens</h1>
        <p className="text-muted-foreground text-sm">Comunicação com anfitriões, locatários e suporte.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>
        {/* Conversation list */}
        <div className="w-80 xl:w-96 border-r border-border/40 overflow-y-auto flex-shrink-0">
          <div className="px-4 py-3 border-b border-border/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversas</p>
          </div>
          <ConversationList
            conversations={conversations}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedId && selectedConv ? (
            <ChatView
              conversationId={selectedId}
              otherName={selectedConv.other_name}
              reservationNotes={selectedConv.reservation_notes}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <MessageSquare size={28} className="text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium">Selecione uma conversa</p>
              <p className="text-xs text-muted-foreground/60">Escolha uma conversa ao lado para visualizar as mensagens.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMensagens;
