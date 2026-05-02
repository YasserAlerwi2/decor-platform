"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ServiceItem {
  id: number;
  slug: string;
  title: string;
  desc: string;
  img: string;
  icon: string;
  actionText: string;
}

const defaultServices: ServiceItem[] = [
  {
    id: 1,
    slug: "marble",
    title: "بدائل الرخام الفاخر",
    desc: "تشطيبات جدارية فخمة تحاكي الطبيعة بمتانة عالية ولمعان استثنائي يجذب الأنظار ويعكس ذوقك الرفيع.",
    img: "/images/lux_marble_wall.png",
    icon: "format_paint",
    actionText: "التفاصيل",
  },
  {
    id: 2,
    slug: "wood",
    title: "بدائل الخشب",
    desc: "تصاميم خشبية دافئة وعصرية تضيف طابعاً فريداً للفراغ المعماري بلمسات طبيعية جذابة.",
    img: "/images/elegant_wood_panels.png",
    icon: "dashboard",
    actionText: "استكشف",
  },
  {
    id: 3,
    slug: "parquet",
    title: "الباركيه",
    desc: "أرضيات باركيه فاخرة تتحمل الاستخدام المكثف وتضفي دفئاً ورونقاً استثنائياً لكل خطوة.",
    img: "/images/parquet_floor.png",
    icon: "grid_view",
    actionText: "استكشف",
  },
  {
    id: 4,
    slug: "tv-unit",
    title: "ديكورات الشاشات",
    desc: "تصاميم مدمجة مع إضاءة مخفية لإضفاء طابع سينمائي راقي وعصري لمنزلك بلمسات احترافية.",
    img: "/images/modern_tv_unit.png",
    icon: "tv",
    actionText: "استكشف",
  },
];

const serviceIcons = ["format_paint", "dashboard", "grid_view", "tv", "architecture", "design_services", "home_repair_service", "construction"];

export default function InteractiveServicesGrid() {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        if (data.services && data.services.length > 0) {
          const mapped: ServiceItem[] = data.services.map((s: any, i: number) => ({
            id: s.id,
            slug: s.slug,
            title: s.name,
            desc: s.description || '',
            img: s.heroImageUrl || '/images/lux_marble_wall.png',
            icon: serviceIcons[i % serviceIcons.length],
            actionText: 'التفاصيل',
          }));
          setServices(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // If user is hovering over the grid, pause the rotation
    if (isHovered) return;
    
    // Switch every 3.5 seconds
    const interval = setInterval(() => {
      setServices((prev) => {
        const next = [...prev];
        const first = next.shift(); // remove first
        if (first) next.push(first); // move to the end
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 md:auto-rows-[250px] lg:auto-rows-[300px] grid-flow-row-dense relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {services.map((service, index) => {
        const isLarge = index === 0;

        const gridClasses = isLarge 
          ? "col-span-2 md:col-span-2 md:row-span-2 h-[350px] md:h-full"
          : "col-span-1 md:col-span-1 md:row-span-1 h-[140px] md:h-full";

        return (
           <motion.div
            layout
            key={service.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ layout: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.85 } }}
            className={`relative rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-lg ${gridClasses} bg-surface-container-low`}
          >
            {/* The image is always mounted so it seamlessly morphs size during layout animation */}
            <img
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              src={service.img}
            />

            <AnimatePresence mode="popLayout">
              {isLarge ? (
                <motion.div
                  key="large"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent md:via-[#000000]/40"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 flex flex-col gap-2 md:gap-4 w-full h-full justify-end">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-surface-container-highest/60 backdrop-blur flex items-center justify-center text-primary group-hover:scale-110 transition-transform hidden md:flex mb-2">
                      <span className="material-symbols-outlined font-light text-xl md:text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="font-headline font-bold text-lg md:text-4xl text-white drop-shadow-md">
                      {service.title}
                    </h3>
                    <p className="font-body text-xs md:text-lg text-white/80 line-clamp-2 md:line-clamp-none max-w-md drop-shadow-sm">
                      {service.desc}
                    </p>
                    <Link
                      className="font-body text-sm md:text-lg font-bold text-primary flex items-center gap-1 mt-2 group-hover:text-secondary transition-colors w-fit"
                      href={`/services/${service.slug}`}
                    >
                      <span>{service.actionText}</span>
                      <span className="material-symbols-outlined text-sm md:text-[20px]">
                        arrow_outward
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="small"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="absolute inset-0 w-full h-full z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/40 to-transparent"></div>
                  <div className="absolute inset-0 p-3 md:p-8 flex flex-col w-full h-full justify-end">
                       <h3 className="font-headline font-bold text-xs md:text-2xl text-white line-clamp-2 w-full">
                         {service.title}
                       </h3>
                       <Link
                         className="font-body text-[10px] md:text-base text-primary flex items-center gap-1 font-bold mt-1 max-w-full"
                         href={`/services/${service.slug}`}
                       >
                         <span className="truncate">{service.actionText}</span>
                         <span className="material-symbols-outlined text-[10px] md:text-sm shrink-0">
                           arrow_outward
                         </span>
                       </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
