import { useState, useRef, useEffect } from "react";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const AIChat = () => {
  const { lang } = useAppStore();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const allMessages = [...msgs, userMsg];
    setMsgs(allMessages);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({}));
        setMsgs((prev) => [...prev, { role: "assistant", content: err.error || "Bir hata oluştu." }]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMsgs((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", content: "Bağlantı hatası." }]);
    }

    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="container max-w-2xl py-20 text-center space-y-4 animate-fade-in">
        <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">{t(lang, "login_required")}</h2>
        <Button asChild className="gradient-primary text-primary-foreground border-0">
          <Link to="/auth">{t(lang, "login")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-sapphire" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "ai_chat")}</h1>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Gemini</span>
      </div>

      <div className="bg-card border border-border rounded-lg flex flex-col h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.length === 0 && (
            <p className="text-center text-muted-foreground py-10">{t(lang, "ai_welcome")}</p>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[75%] text-sm ${
                  m.role === "user"
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {isLoading && msgs[msgs.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-lg px-4 py-2 text-sm text-muted-foreground animate-pulse">
                ...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t(lang, "type_message")}
            className="bg-secondary border-border flex-1"
            disabled={isLoading}
          />
          <Button onClick={send} size="icon" disabled={isLoading} className="gradient-cool text-primary-foreground border-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
