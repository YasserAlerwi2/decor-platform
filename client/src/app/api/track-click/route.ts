import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST /api/track-click — يُستدعى من الموقع عند ضغط زر اتصال أو واتساب
export async function POST(req: Request) {
  try {
    const { clickType, sourcePage, sourceLabel, deviceType, referrer } = await req.json();

    const click = await prisma.contactClick.create({
      data: {
        clickType,
        sourcePage,
        sourceLabel,
        deviceType,
        referrer,
      },
    });

    return NextResponse.json({ success: true, id: click.id });
  } catch {
    // نتجاهل أخطاء التتبع ونُعيد 200 دائماً
    return NextResponse.json({ success: false });
  }
}

// GET /api/track-click — إحصائيات للوحة التحكم
export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [total, whatsapp, phone, today, thisWeek, recent] = await Promise.all([
      prisma.contactClick.count(),
      prisma.contactClick.count({ where: { clickType: 'whatsapp' } }),
      prisma.contactClick.count({ where: { clickType: 'phone' } }),
      prisma.contactClick.count({ where: { clickedAt: { gte: todayStart } } }),
      prisma.contactClick.count({ where: { clickedAt: { gte: weekStart } } }),
      prisma.contactClick.findMany({
        take: 20,
        orderBy: { clickedAt: 'desc' },
      }),
    ]);

    return NextResponse.json({ total, whatsapp, phone, today, thisWeek, recent });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
