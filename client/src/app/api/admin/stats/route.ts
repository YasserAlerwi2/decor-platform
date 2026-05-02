import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/stats - Fetch dashboard statistics
export async function GET() {
  try {
    // Get counts from database
    const [
      galleryCount,
      publishedServicesCount,
      totalServicesCount,
      contactClicksCount,
      whatsappClicksCount,
      siteSettings,
    ] = await Promise.all([
      prisma.galleryImage.count(),
      prisma.service.count({ where: { status: 'published' } }),
      prisma.service.count(), // Total services (all statuses)
      prisma.contactClick.count(),
      prisma.contactClick.count({ where: { clickType: 'whatsapp' } }),
      prisma.siteSettings.findFirst(),
    ]);

    // Get clicks from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentClicks = await prisma.contactClick.count({
      where: {
        clickedAt: { gte: sevenDaysAgo },
      },
    });

    const stats = {
      galleryCount,
      servicesCount: publishedServicesCount,
      totalServicesCount,
      contactClicksCount,
      whatsappClicksCount,
      recentClicks,
      visitsCount: siteSettings?.totalProjects ?? 0,
      siteName: siteSettings?.siteName ?? 'الخدمات المقدمة',
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
