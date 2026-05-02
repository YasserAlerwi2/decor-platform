import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/services/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
      include: { seo: true, category: true, images: { include: { seo: true } } },
    });
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// PATCH /api/admin/services/[id] — تعديل خدمة
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { seo, categoryId, ...serviceData } = body;

    const service = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        ...serviceData,
        categoryId: categoryId ?? null,
        seo: seo ? { upsert: { create: seo, update: seo } } : undefined,
      },
      include: { seo: true, category: true },
    });

    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE /api/admin/services/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
