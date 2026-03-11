import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Bot, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-support`;

const quickActions = [
  { label: "Como funciona?", message: "Como funciona a GuardaAí?" },
  { label: "Preços", message: "Quais são os preços para guardar meus itens?" },
  { label: "Anunciar espaço", message: "Como faço para anunciar meu espaço?" },
  { label: "Segurança", message: "Como a GuardaAí garante a segurança dos meus itens?" },
  { label: "Itens proibidos", message: "Quais itens são proibidos na plataforma?" },
];

const Contact = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (allMessages: Msg[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!resp.ok || !resp.body) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Falha ao conectar com o atendimento.");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch { /* ignore */ }
      }
    }
  };

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(updated);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Desculpe, ocorreu um erro. Tente novamente em instantes." },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col pt-[52px] md:pt-[72px]">
        <div className="container max-w-2xl flex-1 flex flex-col px-4 md:px-8 py-4 md:py-6">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            className="mb-3 gap-1.5 text-muted-foreground self-start"
          >
            <ArrowLeft size={16} /> Voltar
          </Button>

          {/* Chat area */}
          <div className="flex-1 flex flex-col rounded-2xl border bg-card overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-4 border-b bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-foreground">Fale conosco</h1>
                  <p className="text-[11px] text-muted-foreground">Assistente virtual da GuardaAí</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 space-y-4 min-h-[320px] max-h-[55vh]">
              {isEmpty ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles size={28} className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground mb-1">Olá! Como posso ajudar?</h2>
                  <p className="text-xs text-muted-foreground mb-6 max-w-sm">
                    Sou a assistente virtual da GuardaAí. Pergunte sobre preços, segurança, como funciona ou qualquer outra dúvida.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {quickActions.map((qa) => (
                      <button
                        key={qa.label}
                        onClick={() => send(qa.message)}
                        className="px-3 py-1.5 rounded-full border border-border bg-background text-xs font-medium text-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "user" ? "bg-accent/10" : "bg-primary/10"
                      }`}>
                        {msg.role === "user" ? (
                          <User size={14} className="text-accent" />
                        ) : (
                          <Bot size={14} className="text-primary" />
                        )}
                      </div>
                      <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-accent text-accent-foreground rounded-tr-sm"
                          : "bg-secondary/60 text-foreground rounded-tl-sm"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot size={14} className="text-primary" />
                      </div>
                      <div className="bg-secondary/60 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="px-4 md:px-5 py-3 border-t bg-background/80">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 h-10 px-4 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
