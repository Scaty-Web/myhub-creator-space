import { useState } from "react";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot } from "lucide-react";

interface Msg {
  id: number;
  role: "user" | "ai";
  text: string;
}

const quickReplies: Record<string, string> = {
  merhaba: "Merhaba! 🎉 Sana nasıl yardımcı olabilirim?",
  hello: "Hello! 🎉 How can I help you?",
  scratch: "Scratch, MIT tarafından geliştirilen görsel bir programlama dilidir. scratch.mit.edu adresinden erişebilirsin!",
  proje: "Proje paylaşmak için 'Paylaş' sekmesine git, Scratch proje linkini yapıştır ve paylaş!",
  project: "Go to the 'Share' tab, paste your Scratch project link and share it!",
  yardım: "Projelerini paylaşabilir, diğer projeleri keşfedebilir, sohbet edebilir ve mini oyunlar oynayabilirsin!",
  help: "You can share projects, explore others, chat, and play mini games!",
};

function getAIReply(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(quickReplies)) {
    if (lower.includes(key)) return reply;
  }
  return "🤔 Hmm, bunu tam anlayamadım. 'yardım' veya 'help' yazarak başlayabilirsin!";
}

const AIChat = () => {
  const { lang } = useAppStore();
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: "ai", text: lang === "tr" ? "Merhaba! Ben MyHub AI asistanıyım. 🤖 Nasıl yardımcı olabilirim?" : "Hello! I'm MyHub AI assistant. 🤖 How can I help?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text: input.trim() };
    const aiMsg: Msg = { id: Date.now() + 1, role: "ai", text: getAIReply(input.trim()) };
    setMsgs((p) => [...p, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="container max-w-2xl py-8 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-sapphire" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "ai_chat")}</h1>
      </div>

      <div className="bg-card border border-border rounded-lg flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[75%] text-sm ${
                  m.role === "user"
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.text}
              </div>
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
          <Button onClick={send} size="icon" className="gradient-cool text-primary-foreground border-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
