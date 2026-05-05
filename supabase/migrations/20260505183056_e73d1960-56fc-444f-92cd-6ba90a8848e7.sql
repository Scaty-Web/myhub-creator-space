-- Enable RLS on realtime.messages (safe if already enabled)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Drop any prior policy with same name to keep migration idempotent
DROP POLICY IF EXISTS "Room members can subscribe to room channel" ON realtime.messages;

-- Allow authenticated users to receive realtime events on a topic
-- only when the topic matches "room-<room_id>" AND they are a member of that room.
CREATE POLICY "Room members can subscribe to room channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE 'room-%'
  AND EXISTS (
    SELECT 1
    FROM public.room_members rm
    WHERE rm.user_id = auth.uid()
      AND rm.room_id::text = substring(realtime.topic() from 6)
  )
);