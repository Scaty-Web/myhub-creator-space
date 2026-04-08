import { useState, useEffect, useRef } from "react";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Lock, Plus, ArrowLeft, DoorOpen, KeyRound, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  has_password: boolean;
  created_by: string;
  created_at: string;
}

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  text: string;
  created_at: string;
}

const ChatRoom = () => {
  const { lang } = useAppStore();
  const { user, username } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPassword, setNewRoomPassword] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [askPasswordRoom, setAskPasswordRoom] = useState<Room | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from("chat_rooms").select("id, name, created_by, created_at").order("created_at", { ascending: false });
      if (data) setRooms(data.map((r: any) => ({ ...r, has_password: false })));
      // Check which rooms have passwords via RPC
      if (data) {
        const updated = await Promise.all(data.map(async (r: any) => {
          // A room has a password if verify_room_password with empty string returns false
          const { data: isOpen } = await supabase.rpc("verify_room_password", { room_id: r.id, entered_password: "" });
          return { ...r, has_password: isOpen === false };
        }));
        setRooms(updated);
      }
    };
    fetchRooms();
  }, []);

  // Fetch messages + realtime
  useEffect(() => {
    if (!currentRoom) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", currentRoom.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`room-${currentRoom.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${currentRoom.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    const { data, error } = await supabase.from("chat_rooms").insert({
      name: newRoomName.trim(),
      password: newRoomPassword.trim() || null,
      created_by: user.id,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setRooms((prev) => [{ ...data, has_password: !!newRoomPassword.trim() } as Room, ...prev]);
    setNewRoomName("");
    setNewRoomPassword("");
    setShowCreate(false);
    toast.success(t(lang, "room_created"));
  };

  const joinRoom = (room: Room) => {
    if (room.has_password) {
      setAskPasswordRoom(room);
      setJoinPassword("");
    } else {
      setCurrentRoom(room);
      setMessages([]);
    }
  };

  const confirmJoin = async () => {
    if (!askPasswordRoom) return;
    const { data: isValid } = await supabase.rpc("verify_room_password", {
      room_id: askPasswordRoom.id,
      entered_password: joinPassword,
    });
    if (!isValid) {
      toast.error(t(lang, "wrong_password"));
      return;
    }
    setCurrentRoom(askPasswordRoom);
    setMessages([]);
    setAskPasswordRoom(null);
    setJoinPassword("");
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentRoom) return;
    await supabase.from("chat_messages").insert({
      room_id: currentRoom.id,
      user_id: user.id,
      username: username ?? "User",
      text: input.trim(),
    });
    setInput("");
  };

  const deleteRoom = async (roomId: string) => {
    await supabase.from("chat_rooms").delete().eq("id", roomId);
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    toast.success(t(lang, "room_deleted"));
  };

  // Room list view
  if (!currentRoom) {
    return (
      <div className="container max-w-2xl py-8 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{t(lang, "chatroom")}</h1>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-1" />
            {t(lang, "create_room")}
          </Button>
        </div>

        {showCreate && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <Input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder={t(lang, "room_name")}
              className="bg-secondary border-border"
            />
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <Input
                value={newRoomPassword}
                onChange={(e) => setNewRoomPassword(e.target.value)}
                placeholder={t(lang, "room_password_optional")}
                type="password"
                className="bg-secondary border-border flex-1"
              />
            </div>
            <Button onClick={createRoom} className="gradient-primary text-primary-foreground border-0 w-full">
              {t(lang, "create_room")}
            </Button>
          </div>
        )}

        {/* Password dialog */}
        {askPasswordRoom && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <p className="text-sm text-foreground font-medium">
              <Lock className="inline h-4 w-4 mr-1" />
              {t(lang, "enter_room_password")} — {askPasswordRoom.name}
            </p>
            <Input
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmJoin()}
              type="password"
              placeholder={t(lang, "password")}
              className="bg-secondary border-border"
            />
            <div className="flex gap-2">
              <Button onClick={confirmJoin} className="gradient-primary text-primary-foreground border-0 flex-1">
                {t(lang, "join")}
              </Button>
              <Button onClick={() => setAskPasswordRoom(null)} variant="outline" className="flex-1">
                {t(lang, "cancel")}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {rooms.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t(lang, "no_rooms")}</p>
          )}
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => joinRoom(room)}
            >
              <div className="flex items-center gap-3">
                <DoorOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{room.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(room.created_at).toLocaleDateString()}
                  </p>
                </div>
                {room.has_password && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              {room.created_by === user.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chat view inside a room
  return (
    <div className="container max-w-2xl py-8 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => { setCurrentRoom(null); setMessages([]); }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <MessageCircle className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">{currentRoom.name}</h1>
      </div>

      <div className="bg-card border border-border rounded-lg flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t(lang, "no_messages")}</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.user_id === user.id ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] text-sm ${
                  m.user_id === user.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.text}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {m.username} · {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t(lang, "type_message")}
            className="bg-secondary border-border flex-1"
          />
          <Button onClick={sendMessage} size="icon" className="gradient-primary text-primary-foreground border-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
