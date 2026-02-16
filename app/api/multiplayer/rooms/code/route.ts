import { NextResponse } from 'next/server';
import { z } from 'zod';
import { findRoomByCode, joinRoom } from '@/lib/multiplayer/roomService';

export const dynamic = 'force-static';

const joinRoomSchema = z.object({
  code: z.string().trim().min(1),
  displayName: z.string().trim().min(1).optional()
});

function getCodeFromUrl(request: Request) {
  const { searchParams } = new URL(request.url);
  return searchParams.get('code')?.trim() ?? '';
}

export async function GET(request: Request) {
  try {
    const code = getCodeFromUrl(request);

    if (!code) {
      return NextResponse.json({ error: 'Debes indicar un código de sala válido.' }, { status: 400 });
    }

    const room = await findRoomByCode(code);

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error al buscar la sala.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const code = getCodeFromUrl(request);
    const payload = await request.json();
    const result = joinRoomSchema.safeParse({ code, ...payload });

    if (!result.success || !result.data.displayName) {
      return NextResponse.json(
        { error: 'Debes indicar un nombre válido para unirte a la sala.' },
        { status: 400 }
      );
    }

    const joined = await joinRoom({ roomCode: result.data.code, displayName: result.data.displayName });

    return NextResponse.json({ joined }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error al unirte a la sala.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
