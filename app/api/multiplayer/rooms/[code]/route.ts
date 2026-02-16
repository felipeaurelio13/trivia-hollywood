import { NextResponse } from 'next/server';
import { findRoomByCode } from '@/lib/multiplayer/roomService';

interface RouteParams {
  params: Promise<{ code: string }>;
}

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
