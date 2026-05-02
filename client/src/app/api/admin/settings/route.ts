import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/settings - Fetch site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst({
      include: { seo: true, analytics: true },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'العروي للديكورات',
          seo: { create: {} },
          analytics: { create: {} },
        },
        include: { seo: true, analytics: true },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST /api/admin/settings - Save site settings
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { seo, analytics, ...settingsData } = body;

    // Filter out readonly fields from nested objects
    const cleanSeo = seo ? {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaKeywords: seo.metaKeywords,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImageUrl: seo.ogImageUrl,
      canonicalUrl: seo.canonicalUrl,
      robotsDirective: seo.robotsDirective,
    } : null;

    const cleanAnalytics = analytics ? {
      googleAnalyticsId: analytics.googleAnalyticsId,
      googleAdsTag: analytics.googleAdsTag,
      searchConsoleCode: analytics.searchConsoleCode,
      metaPixelId: analytics.metaPixelId,
      snapPixelId: analytics.snapPixelId,
      headerScripts: analytics.headerScripts,
    } : null;

    // Find existing settings or get the first one
    const existingSettings = await prisma.siteSettings.findFirst();

    if (!existingSettings) {
      // Create new settings with all data
      const settings = await prisma.siteSettings.create({
        data: {
          ...settingsData,
          seo: cleanSeo ? { create: cleanSeo } : { create: {} },
          analytics: cleanAnalytics ? { create: cleanAnalytics } : { create: {} },
        },
        include: { seo: true, analytics: true },
      });
      return NextResponse.json(settings);
    }

    // Update existing settings
    const settings = await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: {
        ...settingsData,
        seo: cleanSeo ? {
          upsert: {
            create: cleanSeo,
            update: cleanSeo,
            where: { siteSettingsId: existingSettings.id },
          },
        } : undefined,
        analytics: cleanAnalytics ? {
          upsert: {
            create: cleanAnalytics,
            update: cleanAnalytics,
            where: { siteSettingsId: existingSettings.id },
          },
        } : undefined,
      },
      include: { seo: true, analytics: true },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('POST settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings', details: String(error) }, { status: 500 });
  }
}
