import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/gallery
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
      include: { seo: true, categories: true },
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

// POST /api/admin/gallery — إضافة صورة/صور جديدة
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // يمكن إرسال صورة واحدة أو مصفوفة من الصور
    const images: any[] = Array.isArray(body) ? body : [body];

    const created = await prisma.$transaction(
      images.map(({ seo, categoryIds, ...imgData }) =>
        prisma.galleryImage.create({
          data: {
            ...imgData,
            categories: categoryIds?.length ? { connect: categoryIds.map((id: number) => ({ id })) } : undefined,
            seo: seo ? { create: seo } : undefined,
          },
          include: { seo: true, categories: true },
        })
      )
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
