import { NextResponse } from 'next/server';
import { z } from 'zod';
import { findRoomByCode, joinRoom } from '@/lib/multiplayer/roomService';

export const dynamic = 'force-static';

interface RouteParams {
  params: Promise<{ code: string }>;
}

const joinRoomSchema = z.object({
  displayName: z.string()
});

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { code } = await params;
    const room = await findRoomByCode(code);

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error al buscar la sala.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { code } = await params;
    const payload = await request.json();
    const result = joinRoomSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Debes indicar un nombre válido para unirte a la sala.' },
        { status: 400 }
      );
    }

    const joined = await joinRoom({ roomCode: code, displayName: result.data.displayName });

    return NextResponse.json({ joined }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error al unirte a la sala.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
