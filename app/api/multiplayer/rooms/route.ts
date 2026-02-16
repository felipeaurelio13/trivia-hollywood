import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRoom } from '@/lib/multiplayer/roomService';

export const dynamic = 'force-static';

const createRoomSchema = z.object({
  maxPlayers: z.number().int()
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = createRoomSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Debes indicar una capacidad válida para crear la sala.' },
        { status: 400 }
      );
    }

    const room = await createRoom({ maxPlayers: result.data.maxPlayers });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error al crear la sala.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
