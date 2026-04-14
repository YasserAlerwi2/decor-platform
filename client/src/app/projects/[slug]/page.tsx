import Image from 'next/image';
import Link from 'next/link';

// Mock Data (will be replaced by Prisma query `await prisma.project.findUnique({where: {slug}})`)
const fetchProject = (slug: string) => {
  return {
    title: 'جدارية بديل الرخام الفاخر',
    description: 'تم تصميم هذه الجدارية باستخدام أفضل أنواع بديل الرخام عالي اللمعان، لتُضفي طابعاً ملكياً على غرف الجلوس والمجالس الرئيسية. تتميز بالمتانة وسهولة التنظيف مع إضاءات مخفية تعزز التباين والعمق.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    features: ['مضاد للرطوبة', 'لمعان فائق', 'عمر افتراضي يزيد عن 15 سنة'],
    category: 'بديل رخام الماني'
  };
};

export default async function ProjectDetails({ params }: { params: { slug: string } }) {
  const project = fetchProject(params.slug);

  return (
    <main className="min-h-screen bg-neutral-950 pb-20">
      {/* Huge Header Image */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <Image 
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-8 md:p-20">
          <span className="text-amber-500 font-bold mb-4 tracking-wide text-sm">{project.category}</span>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Details Content */}
      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-200">الرؤية والوصف</h2>
            <p className="text-neutral-400 leading-loose text-lg">
              {project.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-200">المميزات الرئيسية</h2>
            <ul className="space-y-3">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 h-fit sticky top-32 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">هل أعجبك هذا التصميم؟</h3>
          <p className="text-neutral-400 text-sm">يمكننا تنفيذ تصميم مشابه لمساحتك بمواصفات مخصصة وجودة تفوق التوقعات.</p>
          <Link 
            href="/contact"
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-center py-4 rounded-xl transition-all"
          >
            طلب عرض سعر مجاني
          </Link>
        </div>
      </div>
    </main>
  );
}
