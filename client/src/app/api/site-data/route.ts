import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/site-data — Public endpoint for homepage content
export async function GET() {
  try {
    const [settings, services, galleryImages, categories] = await Promise.all([
      prisma.siteSettings.findFirst({
        include: { seo: true },
      }),
      prisma.service.findMany({
        where: { status: 'published' },
        orderBy: { sortOrder: 'asc' },
        include: { seo: true, category: true },
      }),
      prisma.galleryImage.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { seo: true, categories: true },
      }),
      prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({
      settings,
      services,
      galleryImages,
      categories,
    });
  } catch (error) {
    console.error('GET site-data error:', error);
    return NextResponse.json({ error: 'Failed to fetch site data' }, { status: 500 });
  }
}
