import { useState } from "react";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
}

const ChatRoom = () => {
  const { lang } = useAppStore();
  const { user, username } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, author: "Bot", text: lang === "tr" ? "Sohbete hoş geldiniz! 🎉" : "Welcome to the chat! 🎉", time: "12:00" },
  ]);
  const [input, setInput] = useState("");

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

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: username ?? "User",
        text: input.trim(),
        time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      },
    ]);
    setInput("");
  };

  return (
    <div className="container max-w-2xl py-8 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "chatroom")}</h1>
      </div>

      <div className="bg-card border border-border rounded-lg flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.author === (username ?? "User") ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] text-sm ${
                  m.author === (username ?? "User")
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.text}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {m.author} · {m.time}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t(lang, "type_message")}
            className="bg-secondary border-border flex-1"
          />
          <Button onClick={send} size="icon" className="gradient-primary text-primary-foreground border-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
