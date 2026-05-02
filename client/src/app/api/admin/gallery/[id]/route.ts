import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH /api/admin/gallery/[id] — تعديل SEO صورة
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { seo, categoryIds, ...imgData } = await req.json();

    const image = await prisma.galleryImage.update({
      where: { id: Number(id) },
      data: {
        ...imgData,
        categories: categoryIds !== undefined ? { set: categoryIds.map((id: number) => ({ id })) } : undefined,
        seo: seo ? { upsert: { create: seo, update: seo } } : undefined,
      },
      include: { seo: true, categories: true },
    });

    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

// DELETE /api/admin/gallery/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.galleryImage.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
