import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

const UPLOAD_PROXY_URL = process.env.UPLOAD_PROXY_URL || '';

// Helper function to generate SEO-friendly filename
function generateSeoFilename(serviceName: string, siteName: string): string {
  // Combine service name and site name
  const combinedName = `${serviceName} ${siteName}`;
  
  // Convert to SEO-friendly format
  const seoName = combinedName
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '') // Keep Arabic letters
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80); // Limit length
  
  return seoName;
}

// POST /api/upload - Upload and compress image to WebP
export async function POST(req: NextRequest) {
  try {
    // If UPLOAD_PROXY_URL is set (Vercel), forward to Hostinger
    if (UPLOAD_PROXY_URL) {
      const formData = await req.formData();
      const proxyRes = await fetch(`${UPLOAD_PROXY_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await proxyRes.json();
      return NextResponse.json(data, { status: proxyRes.status });
    }

    // Local upload (Hostinger)
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    const serviceName = formData.get('serviceName') as string || '';
    const customName = formData.get('customName') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Create folder if not exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    // Get site name from database
    let siteName = 'alorwi';
    try {
      const settings = await prisma.siteSettings.findFirst();
      if (settings?.siteName) {
        siteName = settings.siteName;
      }
    } catch (e) {
      console.log('Could not fetch site name, using default');
    }

    // Generate SEO-friendly filename
    let baseFilename: string;
    if (customName) {
      baseFilename = generateSeoFilename(customName, siteName);
    } else if (serviceName) {
      baseFilename = generateSeoFilename(serviceName, siteName);
    } else {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      baseFilename = `${timestamp}-${randomStr}`;
    }

    // Add timestamp to make filename unique
    const timestamp = Date.now();
    const filename = `${baseFilename}-${timestamp}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compress and convert to WebP using sharp
    await sharp(buffer)
      .webp({
        quality: 85, // Good quality with good compression
        effort: 6,   // Balance between speed and compression
      })
      .resize(1920, 1080, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFile(filepath);

    // Return public URL
    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      format: 'webp',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

// DELETE /api/upload - Delete image
export async function DELETE(req: NextRequest) {
  try {
    // If UPLOAD_PROXY_URL is set (Vercel), forward to Hostinger
    if (UPLOAD_PROXY_URL) {
      const proxyRes = await fetch(`${UPLOAD_PROXY_URL}/api/upload?url=${encodeURIComponent(new URL(req.url).searchParams.get('url') || '')}`, {
        method: 'DELETE',
      });
      const data = await proxyRes.json();
      return NextResponse.json(data, { status: proxyRes.status });
    }

    // Local delete (Hostinger)
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const filepath = path.join(process.cwd(), 'public', imageUrl);
    const { unlink } = await import('fs/promises');
    await unlink(filepath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
