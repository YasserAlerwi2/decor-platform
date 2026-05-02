import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/services — قائمة الخدمات
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { seo: true, category: true },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/admin/services — إضافة خدمة جديدة
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { seo, categoryId, ...serviceData } = body;

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        categoryId: categoryId || null,
        seo: seo ? { create: seo } : undefined,
      },
      include: { seo: true, category: true },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
