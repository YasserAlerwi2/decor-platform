import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic API route to test connection
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Futuristic Decor API is running perfectly.' });
});

app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    // We will fetch from database later when we seed data
    // const projects = await prisma.project.findMany({ include: { gallery: true } });
    res.status(200).json({
      success: true,
      data: [
        { id: 1, title: 'بديل الرخام الفاخر', subtitle: 'مجالس فخمة بتصاميم عصرية' },
        { id: 2, title: 'دهانات داخلية', subtitle: 'ألوان هادئة تعكس الرقي' }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const { title, slug, description, categoryId, mainImage } = req.body;
    res.status(201).json({
      success: true,
      message: 'تم حفظ العمل بنجاح',
      data: { title, slug }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// --- Leads / Quotes API ---
// Store leads in memory as a fallback until DB is fully connected
let mockLeads: any[] = [
  { id: '1', name: 'سليمان خالد', phone: '+966 50 111 2233', service: 'تركيب بديل الرخام', details: 'صالة ضيوف بفيلا', status: 'NEW', createdAt: new Date() },
  { id: '2', name: 'عبدالله محمد', phone: '+966 55 999 8877', service: 'دهانات داخلية متطورة', details: 'تجديد غرفة نوم', status: 'CONTACTED', createdAt: new Date() }
];

app.get('/api/leads', async (req: Request, res: Response) => {
  try {
    // const leads = await prisma.quoteRequest.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: mockLeads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const { name, phone, service, details } = req.body;
    
    const newLead = {
      id: Date.now().toString(),
      name,
      phone,
      service,
      details,
      status: 'NEW',
      createdAt: new Date()
    };
    
    // Simulate DB Insert
    // await prisma.quoteRequest.create({ data: newLead });
    mockLeads.unshift(newLead);

    res.status(201).json({
      success: true,
      message: 'Lead captured successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running elegantly on http://localhost:${PORT}`);
});
