import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Truck, 
  Trash2, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Menu, 
  X, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Star,
  ChevronRight,
  Loader2,
  Box,
  Package,
  Archive,
  Sofa,
  Wrench,
  Hammer,
  Wind,
  Trash,
  Key,
  Calendar,
  DollarSign,
  Recycle,
  ChevronLeft,
  MessageCircle,
  ChevronDown,
  Upload,
  Camera,
  RefreshCw
} from 'lucide-react';
import DatePicker from 'react-datepicker';

const services = [
  {
    id: "residential",
    title: "Residential Removal",
    desc: "Comprehensive home decluttering solutions for Scottsdale, Arcadia, and Paradise Valley. From furniture removal to full estate cleanouts, we handle it all with care.",
    items: ["Furniture & Sofas", "Mattresses & Bedframes", "Appliances", "Garage Cleanouts"],
    icon: <Trash2 className="text-teal-600" size={32} />,
    link: "#quote",
    details: "Our residential removal service covers all of Scottsdale and the Phoenix Metro area. We specialize in navigating high-end properties in Paradise Valley and Arcadia, ensuring zero damage while removing heavy items like sofas, appliances, and garage debris.",
    examples: [
      "Scottsdale garage decluttering",
      "Paradise Valley estate cleanouts",
      "Arcadia furniture disposal",
      "Phoenix attic purges",
      "Glendale mattress removal"
    ],
    pricing: [
      { tier: "Single Item", price: "Starting at $99", desc: "Perfect for one large item like a sofa or fridge." },
      { tier: "1/4 Truck Load", price: "Starting at $199", desc: "Ideal for a small closet or a few pieces of furniture." },
      { tier: "1/2 Truck Load", price: "Starting at $349", desc: "Great for a single room or large garage cleanup." },
      { tier: "Full Truck Load", price: "Starting at $599", desc: "Maximum value for whole-house or estate cleanouts." }
    ]
  },
  {
    id: "commercial",
    title: "Commercial Junk",
    desc: "Efficient office and retail debris removal in Phoenix, Glendale, and Surprise. We work around your schedule to keep your business running smoothly.",
    items: ["Office Desks & Chairs", "Electronic Waste (E-Waste)", "Store Fixtures", "Construction Debris"],
    icon: <Truck className="text-teal-600" size={32} />,
    link: "#quote",
    details: "Serving the growing business corridors of Phoenix, Glendale, and Surprise. We specialize in E-waste recycling and commercial furniture liquidation, providing tax-deductible donation receipts whenever possible.",
    examples: [
      "Phoenix office furniture liquidation",
      "Glendale retail fixture removal",
      "Surprise construction site debris",
      "Scottsdale warehouse clearing",
      "Cave Creek ranch debris removal"
    ],
    pricing: [
      { tier: "Office Refresh", price: "Custom Quote", desc: "Removal of a few desks, chairs, and electronics." },
      { tier: "Retail Clearout", price: "Custom Quote", desc: "Full store fixture and inventory disposal." },
      { tier: "Construction Site", price: "Starting at $450", desc: "Debris removal for renovation projects." },
      { tier: "Ongoing Service", price: "Contract Rates", desc: "Scheduled pickups for property managers." }
    ]
  },
  {
    id: "yard",
    title: "Yard Waste",
    desc: "Desert-specific yard waste removal for Sun City, Cave Creek, and Surprise. We remove palm fronds, cacti, and structural outdoor debris.",
    items: ["Tree Branches & Brush", "Old Fencing & Wood", "Sod & Soil", "Patio Furniture"],
    icon: <CheckCircle className="text-teal-600" size={32} />,
    link: "#quote",
    details: "Specializing in Arizona-native landscaping debris. We help residents in Cave Creek and Sun City manage storm cleanup and desert landscape renewals, including heavy rock, soil, and palm removal.",
    examples: [
      "Cave Creek storm debris cleanup",
      "Sun City yard waste removal",
      "Surprise fence disposal",
      "Scottsdale patio furniture recycling",
      "Phoenix cactus and palm removal"
    ],
    pricing: [
      { tier: "Minimum Load", price: "Starting at $125", desc: "Small pile of brush or a few bags of yard waste." },
      { tier: "Standard Cleanup", price: "Starting at $250", desc: "Typical backyard seasonal cleanup debris." },
      { tier: "Heavy Debris", price: "Starting at $400", desc: "Soil, sod, or concrete removal (weight limits apply)." },
      { tier: "Full Property", price: "Starting at $650", desc: "Complete yard transformation debris removal." }
    ]
  },
  {
    id: "moveout",
    title: "After Move Out",
    desc: "Seamless junk removal for tenants and homeowners across Glendale, Peoria, and Scottsdale. We clear everything left behind so you can focus on your move.",
    items: ["Leftover Furniture", "Abandoned Boxes", "Kitchen Debris", "Cleaning Supplies"],
    icon: <Truck className="text-teal-600" size={32} />,
    link: "#quote",
    details: "Moving is stressful enough. Our 'After Move Out' service is designed for rapid response in Peoria, Glendale, and Scottsdale. We handle the heavy lifting of abandoned items, ensuring properties are broom-clean for the next occupant.",
    examples: [
      "Peoria apartment move-out clears",
      "Glendale house sale preparation",
      "Scottsdale luxury rental cleanouts",
      "Norterra townhome junk removal",
      "Surprise relocation debris hauling"
    ],
    pricing: [
      { tier: "Few Items", price: "Starting at $149", desc: "Removal of a few boxes and small furniture pieces." },
      { tier: "Standard Room", price: "Starting at $249", desc: "Clearing out a full bedroom or kitchen's worth of leftovers." },
      { tier: "Full Home Clear", price: "Custom Quote", desc: "Comprehensive junk removal for entire properties." }
    ]
  }
];

const blogPosts = [
  {
    id: "arizona-junk-laws-2024",
    title: "New 2024 Arizona Disposal Regulations You Need to Know",
    excerpt: "Arizona has updated laws on how e-waste and batteries must be handled. Learn how these effects your next junk removal project in Scottsdale and Phoenix.",
    author: "Eco Team",
    date: "April 24, 2024",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
    content: `Arizona environmental regulations are becoming stricter to protect our unique desert ecosystem. As of 2024, the Phoenix Metro area has new guidelines for disposing of lithium batteries and high-grade plastics. At RemoveALL, we stay ahead of these changes to ensure your junk doesn't end up where it shouldn't.

If you're in Scottsdale or Glendale, you might have noticed changes at local landfills. We handle the sorting and specialized transport required for modern compliance. Don't risk fines or environmental damage—let our professionals manage your disposal needs according to the latest Valley-wide standards.`
  },
  {
    id: "summer-storage-tips",
    title: "Summer Heat & Junk: Protecting Your Storage in Surprise and Sun City",
    excerpt: "The Arizona heat can turn your garage into an oven. Learn which items can become fire hazards or melt during our intense summer months.",
    author: "Safety Specialist",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1590059345265-5136868af2d2?auto=format&fit=crop&q=80&w=800",
    content: `When temperatures hit 115°F in Phoenix and Surprise, your garage can exceed 140°F. This heat isn't just uncomfortable; it's a hazard for stored junk. Electronics, aerosol cans, and old paint left in Sun City garages can become active risks.

We recommend a 'Pre-Summer Purge' for residents in Cave Creek and Arcadia. Removing flammable debris and heat-sensitive materials before June hits can save you from a disaster. Our team specializes in rapid garage cleanouts for heat-sensitive items.`
  },
  {
    id: "eco-friendly-decluttering",
    title: "Eco-Friendly Decluttering in Paradise Valley: A Resident's Guide",
    excerpt: "Discover how to responsibly purge your high-end furniture and appliances while supporting local Arizona charities.",
    author: "Sustainability Director",
    date: "February 28, 2024",
    image: "https://images.unsplash.com/photo-1618220179428-22790b46d013?auto=format&fit=crop&q=80&w=800",
    content: `Paradise Valley homeowners often have high-quality items that shouldn't go to a landfill. We partner with local charities across the Valley of the Sun to ensure your furniture finds a second home.

From high-end appliances to designer furniture in Arcadia, our removal process prioritizes donation over disposal. Learn how our eco-certified team separates recyclables from donations, helping you declutter with a clear conscience.`
  }
];


declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// --- Animation Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// --- Utility: Retry with Exponential Backoff ---
const withRetry = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  initialDelay: number = 3000
): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorStr = JSON.stringify(error).toLowerCase();
      const messageStr = (error.message || "").toLowerCase();
      
      const isRetryable = 
        errorStr.includes("503") || 
        errorStr.includes("high demand") ||
        errorStr.includes("unavailable") ||
        messageStr.includes("503") ||
        messageStr.includes("high demand") ||
        messageStr.includes("unavailable");
      
      if (!isRetryable || i === maxRetries - 1) {
        console.error("Non-retryable error or max retries reached:", error);
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, i);
      console.warn(`Retrying after ${delay}ms due to high demand (Attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

// --- Junk Background Component ---

const JunkBackground = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 1.2]);
  const blur = useTransform(scrollYProgress, [0, 0.15], [0, 10]);

  const junkItems = useMemo(() => {
    const icons = [Box, Package, Archive, Sofa, Wrench, Hammer, Trash, Wind, Trash2];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 40) + 20,
      rotate: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.1,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <motion.div 
      style={{ opacity, scale, filter: `blur(${blur}px)` }}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {junkItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: item.opacity, scale: 1 }}
          transition={{ delay: item.delay, duration: 1 }}
          className="absolute text-teal-900/40"
          style={{
            top: item.top,
            left: item.left,
            rotate: item.rotate,
          }}
        >
          <item.Icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}
    </motion.div>
  );
};

// --- Logo Component using Gemini ---

const Logo = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <Link 
      to="/" 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-3 group"
    >
      <div className="flex flex-col leading-none items-center">
        <span className={`text-2xl font-display font-black italic tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
          Remove-<span className="text-teal-500">ALL</span>
        </span>
        <div className="flex items-center gap-2 w-full">
          <div className="h-[1px] flex-grow bg-teal-500/50"></div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}>
            Junk Removal
          </span>
          <div className="h-[1px] flex-grow bg-teal-500/50"></div>
        </div>
      </div>
    </Link>
  );
};


// --- Gallery Component using Nano Banana Pro ---

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  const generateGallery = async () => {
    setLoading(true);
    setNeedsKey(false);
    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNeedsKey(true);
          setLoading(false);
          return;
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompts = [
        "A perfectly clean, empty modern garage with white walls and a gray epoxy floor, bright lighting, high resolution.",
        "A beautiful, cleared out backyard in Scottsdale Arizona with desert landscaping and a clean patio, sunny day.",
        "A professionally organized and empty storage unit, clean and bright."
      ];

      const generatedImages: string[] = [];
      for (const prompt of prompts) {
        const response = await withRetry(() => ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
              imageSize: "1K"
            }
          }
        }));

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            generatedImages.push(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
      setImages(generatedImages);
    } catch (error: any) {
      console.error("Gallery generation failed:", error);
      if (error.message?.includes("403") || error.message?.includes("permission") || error.message?.includes("Requested entity was not found")) {
        setNeedsKey(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      generateGallery();
    }
  };

  useEffect(() => {
    generateGallery();
  }, []);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          viewport={fadeIn.viewport}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-black text-gray-900 mb-4 tracking-tighter uppercase">See the Results</h2>
          <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We transform cluttered spaces into clean, usable areas.
          </p>
        </motion.div>

        {needsKey ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Key className="text-teal-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">API Key Required</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              To generate high-quality project images, you need to select a paid Gemini API key.
            </p>
            <button 
              onClick={handleSelectKey}
              className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all flex items-center gap-2"
            >
              Select API Key
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="text-teal-600 animate-spin" size={48} />
            <p className="text-gray-500 font-medium animate-pulse">Generating real-time project examples...</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={staggerContainer.viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {images.length > 0 ? images.map((img, i) => (
              <motion.div 
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-video rounded-3xl overflow-hidden shadow-lg"
              >
                <img 
                  src={img} 
                  alt={`Project ${i + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-bold">Professional Result #{i + 1}</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-400">Click refresh to generate project examples.</p>
                <button onClick={generateGallery} className="mt-4 text-teal-600 font-bold hover:underline">Generate Gallery</button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

// --- Testimonials Component ---

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      location: "Scottsdale",
      quote: "RemoveALL was incredible! They cleared out my entire garage in under an hour. Professional, polite, and very reasonably priced.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Paradise Valley",
      quote: "I had an old sofa and some construction debris that needed to go. They showed up on time and left the area spotless. Highly recommend!",
      rating: 5
    },
    {
      name: "Amanda Ross",
      location: "Arcadia",
      quote: "Best junk removal service in the Valley. The team was super careful around my property and the teal truck looks great too!",
      rating: 5
    },
    {
      name: "David Miller",
      location: "North Phoenix",
      quote: "Transparent pricing and fast service. It's rare to find a company that actually does what they say they'll do. 5 stars!",
      rating: 5
    }
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          viewport={fadeIn.viewport}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-black text-gray-900 mb-4 uppercase tracking-tighter">What Our Clients Say</h2>
          <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            Don't just take our word for it. We pride ourselves on 5-star service across the Valley.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={staggerContainer.viewport}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {reviews.map((review, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex text-teal-600 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8 flex-grow leading-relaxed text-lg">"{review.quote}"</p>
              <div>
                <p className="font-display font-black text-gray-900 uppercase tracking-wider">{review.name}</p>
                <p className="text-sm text-teal-600 font-bold uppercase tracking-widest">{review.location}, AZ</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- Before & After Slider Component ---

const BeforeAfterSlider = ({ before, after }: { before: string; after: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing) return;
    
    const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - container.left) / container.width) * 100;
    
    if (position >= 0 && position <= 100) {
      setSliderPos(position);
    }
  };

  return (
    <div 
      className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl border-4 border-white"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
      onTouchStart={() => setIsResizing(true)}
      onTouchEnd={() => setIsResizing(false)}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100vw' }} // Ensure it doesn't shrink
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-teal-600 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-white/50 rounded-full"></div>
            <div className="w-1 h-4 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Before</div>
      <div className="absolute bottom-6 right-6 bg-teal-600/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">After</div>
    </div>
  );
};

const TransformationSection = () => {
  const [images, setImages] = useState<{ before: string; after: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const generateTransformation = async (customFile?: string) => {
    setLoading(true);
    setNeedsKey(false);
    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNeedsKey(true);
          setLoading(false);
          return;
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      let beforeBase64 = customFile ? customFile.split(',')[1] : '';

      if (!beforeBase64) {
        // 1. Generate Random Before Image if none provided
        const beforeResponse = await withRetry(() => ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: { parts: [{ text: "A very cluttered, messy garage filled with old boxes, broken furniture, trash bags, and dusty junk. High resolution, realistic lighting." }] },
          config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
        }));

        for (const part of beforeResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) beforeBase64 = part.inlineData.data;
        }
      }

      if (!beforeBase64) throw new Error("Failed to provide or generate before image");

      // 2. Generate After Image using Before Image as reference
      const afterResponse = await withRetry(() => ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: beforeBase64,
                mimeType: "image/png"
              }
            },
            {
              text: "Completely remove all the junk, boxes, and furniture from this exact space. The space should be entirely empty, pristine clean, and professionally organized. Keep the underlying architectural structure (walls, floor, ceiling, windows, doors) identical to the provided image. High resolution, professional photography style."
            }
          ]
        },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
      }));

      let afterBase64 = '';
      for (const part of afterResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) afterBase64 = part.inlineData.data;
      }

      if (beforeBase64 && afterBase64) {
        setImages({ 
          before: customFile || `data:image/png;base64,${beforeBase64}`, 
          after: `data:image/png;base64,${afterBase64}` 
        });
        setPreviewImage(null);
      }
    } catch (error: any) {
      console.error("Transformation generation failed:", error);
      if (error.message?.includes("403") || error.message?.includes("permission") || error.message?.includes("Requested entity was not found")) {
        setNeedsKey(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setPreviewImage(null);
    setImages(null);

    const reader = new FileReader();
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    reader.onload = async (event) => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      setUploading(false);
      
      setTimeout(() => {
        generateTransformation(base64);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      generateTransformation();
    }
  };

  useEffect(() => {
    generateTransformation();
  }, []);

  return (
    <section id="about" className="py-16 md:py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={staggerContainer.viewport}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl lg:text-5xl font-display font-black mb-6 leading-tight uppercase tracking-tighter">
              The <span className="text-teal-500">Transformation</span> is Real.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-400 mb-8 leading-relaxed">
              Don't just imagine a clean space—see it for yourself. Our AI-powered tool can visualize your cluttered space completely cleared in seconds.
            </motion.p>
            
            <div className="space-y-6 mb-10">
              <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-teal-500" />
                  Try it with your space
                </h4>
                <p className="text-sm text-gray-500 mb-6">Upload a photo of your cluttered garage, room, or yard to see the "After" effect.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <div className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all">
                      <Camera size={20} />
                      {uploading ? "Processing..." : "UPLOAD PHOTO"}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      disabled={loading || uploading}
                    />
                  </label>
                  <button 
                    onClick={() => generateTransformation()}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    SHUFFLE EXAMPLE
                  </button>
                </div>
              </motion.div>

              <motion.ul variants={staggerContainer} className="space-y-4">
                {[
                  "Full Property Cleanouts",
                  "Eco-Friendly Disposal",
                  "Same-Day Service Available",
                  "100% Satisfaction Guaranteed"
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeIn} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="text-teal-500" size={20} />
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            initial="initial"
            whileInView="whileInView"
            viewport={scaleIn.viewport}
            className="relative"
          >
            {needsKey ? (
              <div className="aspect-video bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/10 p-8 text-center">
                <Key className="text-teal-500" size={48} />
                <h3 className="text-xl font-bold">API Key Required</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  A paid Gemini API key is required to use the AI transformation tool.
                </p>
                <button 
                  onClick={handleSelectKey}
                  className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all"
                >
                  Select API Key
                </button>
              </div>
            ) : uploading ? (
              <div className="aspect-video bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-6 border border-white/10 p-8">
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-teal-500 font-bold text-xs uppercase tracking-widest">Uploading Photo</span>
                    <span className="text-teal-500 font-bold text-xs">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-teal-500"
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-sm animate-pulse">Preparing your image for visualization...</p>
              </div>
            ) : loading ? (
              <div className="aspect-video bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/10 relative overflow-hidden">
                {previewImage && (
                  <motion.img 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    src={previewImage}
                    className="absolute inset-0 w-full h-full object-cover blur-sm"
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Trash2 className="text-teal-500 w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-sm">
                      Removing Clutter...
                    </p>
                    <p className="text-xs text-gray-600 italic">Clearing space using AI Vision</p>
                  </div>
                </div>
                
                {/* Visual Scanning Effect */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.5)] z-20"
                />
              </div>
            ) : images ? (
              <BeforeAfterSlider before={images.before} after={images.after} />
            ) : (
              <div className="aspect-video bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                <button onClick={() => generateTransformation()} className="text-teal-500 font-bold uppercase tracking-widest hover:underline">
                  Start Transformation
                </button>
              </div>
            )}
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -left-4 bg-teal-600 text-white p-3 rounded-xl shadow-xl z-20 hidden md:block">
              <div className="text-xs font-bold uppercase tracking-tight">AI Vision</div>
              <div className="text-[10px] opacity-75">Clearing technology v3.1</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Rest of the Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Logo isScrolled={isScrolled} />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Services'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase()}`}
              className={`text-xs font-display font-black uppercase tracking-widest hover:text-teal-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
            >
              {item}
            </Link>
          ))}

          {/* About Dropdown */}
          <div className="relative group">
            <button className={`flex items-center gap-1 text-xs font-display font-black uppercase tracking-widest hover:text-teal-600 transition-colors cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>
              About <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50">
              <Link to="/about" className="block px-6 py-3 text-xs font-display font-bold text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors uppercase tracking-widest">Our Story</Link>
              <Link to="/process" className="block px-6 py-3 text-xs font-display font-bold text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors uppercase tracking-widest">Our Process</Link>
            </div>
          </div>

          {['Areas', 'Contact'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase() === 'contact' ? 'callback' : item.toLowerCase()}`} 
              className={`text-xs font-display font-black uppercase tracking-widest hover:text-teal-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
            >
              {item}
            </Link>
          ))}

          <Link 
            to="/blog"
            className={`text-xs font-display font-black uppercase tracking-widest hover:text-teal-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
          >
            Blog
          </Link>
          <a 
            href="tel:6025014109" 
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-full font-black uppercase tracking-tighter hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
          >
            <Phone size={18} />
            <span>Call Us</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className={isScrolled ? 'text-black' : 'text-white'} /> : <Menu className={isScrolled ? 'text-black' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
          >
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="px-4 py-8 space-y-6"
            >
              {['Services', 'About', 'Process', 'Areas', 'Contact'].map((item) => (
                <motion.div
                  key={item}
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 }
                  }}
                >
                  <Link 
                    to={`/${item.toLowerCase() === 'contact' ? 'callback' : item.toLowerCase()}`} 
                    className={`block ${item === 'Process' ? 'pl-8 text-xl text-gray-500' : 'text-2xl'} font-display font-black text-gray-900 tracking-tighter hover:text-teal-600 transition-colors uppercase`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                variants={{
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 }
                }}
              >
                <Link 
                  to="/blog" 
                  className="block text-4xl font-display font-black text-gray-900 tracking-tighter hover:text-teal-600 transition-colors uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </motion.div>
              <motion.a 
                href="tel:6025014109" 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="flex items-center justify-center gap-3 bg-teal-600 text-white px-5 py-5 rounded-2xl font-black text-xl shadow-xl shadow-teal-600/20"
              >
                <Phone size={24} />
                Call Us
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-20 overflow-hidden bg-black">
      <JunkBackground />
      {/* Background Image with Overlay and subtle zoom */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=2070" 
          alt="Junk Removal Truck" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="whileInView"
          className="text-center lg:text-left"
        >
          <motion.div 
            variants={fadeIn}
            className="inline-flex items-center gap-2 bg-teal-600/20 border border-teal-600/30 text-teal-400 px-4 py-2 rounded-full text-sm font-bold mb-6"
          >
            <CheckCircle size={16} />
            #1 Junk Removal in Arizona
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="mb-12 relative w-full flex justify-center lg:justify-start"
          >
            <div className="absolute inset-0 bg-teal-500/20 blur-[120px] rounded-full" />
            <div className="relative z-10 flex flex-col items-center lg:items-start">
              <span className="text-6xl sm:text-8xl md:text-9xl font-display font-black italic text-white tracking-tighter drop-shadow-2xl">
                Remove-<span className="text-teal-500">ALL</span>
              </span>
              <div className="flex items-center gap-4 w-full mt-2">
                <div className="h-1 flex-grow bg-teal-500/40"></div>
                <span className="text-sm sm:text-lg font-black uppercase tracking-[0.4em] text-gray-300 whitespace-nowrap">
                  Junk Removal
                </span>
                <div className="h-1 flex-grow bg-teal-500/40"></div>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="font-display font-black text-white leading-tight mb-6"
          >
            <span className="text-4xl sm:text-5xl md:text-6xl block opacity-90 uppercase tracking-tighter">
              Reclaim Your <span className="text-teal-500">SPACE</span>
            </span>
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Regional hauling experts for Scottsdale, Glendale, Surprise, Sun City, and Cave Creek. From Arcadia to Paradise Valley, we handle every cleanup with professional precision.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(20, 184, 166, 0)", "0px 0px 20px rgba(20, 184, 166, 0.4)", "0px 0px 0px rgba(20, 184, 166, 0)"]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              href="#/quote" 
              className="bg-teal-500 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-teal-500/40"
            >
              BOOK NOW
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </motion.a>
            <a 
              href="tel:6025014109" 
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <Phone size={20} />
              (602) 501-4109
            </a>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i+10}`} 
                  className="w-10 h-10 rounded-full border-2 border-black"
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start text-yellow-500 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-sm text-gray-400 font-medium">500+ Happy Customers in PHX</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="whileInView"
          id="quote"
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 w-full max-w-md mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Instant Estimate</h3>
          <p className="text-gray-500 mb-6">Fill out the form below for a quick quote.</p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="(602) 501-4109" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="john@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Area</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none">
                <option>Scottsdale</option>
                <option>Paradise Valley</option>
                <option>Phoenix Metro</option>
                <option>Glendale</option>
                <option>Surprise</option>
                <option>Sun City</option>
                <option>Cave Creek</option>
                <option>Arcadia</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Junk Type</label>
              <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all h-24" placeholder="What do you need removed? (e.g. Sofa, Yard Waste, Old TV)"></textarea>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              Send My Quote Request
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-4">
              By clicking, you agree to be contacted via phone/SMS regarding your request.
            </p>
          </form>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden sm:flex"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-teal-500 to-transparent"></div>
      </motion.div>
    </section>
  );
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-4xl font-black mb-4">Service Not Found</h2>
        <button onClick={() => navigate('/')} className="text-teal-600 font-bold hover:underline">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-8 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Home
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-teal-600/10 rounded-2xl flex items-center justify-center">
            {service.icon}
          </div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{service.title}</h3>
        </div>

        <p className="text-xl text-gray-600 leading-relaxed mb-10">
          {service.details || service.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 py-10 border-y border-gray-100">
          <div className="space-y-6">
            <h4 className="text-sm font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle size={18} />
              What's Included
            </h4>
            <ul className="grid gap-4">
              {(service.examples || service.items).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 font-medium bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-teal-100 hover:bg-teal-50/30 transition-colors">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={18} />
              Pricing Tiers
            </h4>
            <div className="space-y-4">
              {(service.pricing || []).map((tier: any, i: number) => (
                <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 text-lg">{tier.tier}</span>
                    <span className="text-teal-600 font-black bg-teal-50 px-3 py-1 rounded-lg text-sm">{tier.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="#quote" 
            className="flex-1 bg-teal-600 text-white py-5 rounded-2xl font-black text-center hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20"
          >
            BOOK THIS SERVICE
          </a>
          <a 
            href="tel:6025014109" 
            className="flex-1 bg-black text-white py-5 rounded-2xl font-black text-center hover:bg-gray-900 transition-all"
          >
            CALL FOR CUSTOM QUOTE
          </a>
        </div>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: "Hi! How can I help you with your junk removal needs today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const chatHistory = [
        {
          role: "user",
          parts: [{ text: `You are a helpful AI assistant for "Remove-ALL", a junk removal service. Here are our services: ${JSON.stringify(services)}. Answer questions about our services professionally.` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to help customers with their junk removal questions." }],
        },
        ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: chatHistory,
      });
      
      const responseText = result.text || "";
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-2xl hover:bg-teal-700 transition-all z-50"
      >
        <MessageCircle size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100"
          >
            <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">Remove-ALL Assistant</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-teal-50 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'}`}>
                  {m.text}
                </div>
              ))}
              {isLoading && <div className="text-gray-500 text-sm">Assistant is typing...</div>}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-gray-50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Ask a question..."
              />
              <button onClick={handleSend} className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CallbackRequest = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <section id="callback" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 rounded-[4rem] p-8 md:p-16 border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={staggerContainer.viewport}
            >
              <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-6 leading-tight uppercase tracking-tighter">
                NEED A <span className="text-teal-600">CALLBACK</span>?
              </motion.h2>
              <motion.p variants={fadeIn} className="text-xl text-gray-600 mb-8 leading-relaxed">
                Prefer to talk? Select a date and time, and one of our local experts will reach out to discuss your project.
              </motion.p>
              
              <motion.div variants={fadeIn} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
                    <Phone className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-tight">Expert Consultation</h4>
                    <p className="text-gray-500">Get answers to specific project questions.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
                    <Clock className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-tight">Convenient Scheduling</h4>
                    <p className="text-gray-500">We call you when it fits your day.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="initial"
              whileInView="whileInView"
              viewport={scaleIn.viewport}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100"
            >
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl px-6 py-5 outline-none transition-all font-black uppercase tracking-tight text-gray-900" 
                    placeholder="E.G. JOHN SMITH" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl px-6 py-5 outline-none transition-all font-black tracking-widest text-gray-900" 
                    placeholder="(602) 000-0000" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Date & Time</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl px-6 py-5 outline-none transition-all font-black text-gray-900"
                    wrapperClassName="w-full"
                    minDate={new Date()}
                  />
                </div>

                <button type="button" className="w-full bg-teal-600 text-white py-6 rounded-2xl font-display font-black text-xl hover:bg-teal-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-teal-600/30 uppercase tracking-widest mt-4">
                  Request Callback
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Which areas in the Phoenix Metro do you serve?",
      answer: "We serve most of the Valley of the Sun, with a focus on Scottsdale, Phoenix, Glendale, Surprise, Sun City, Cave Creek, Arcadia, and Paradise Valley. If you're unsure if you're in our range, give us a call at (602) 501-4109!"
    },
    {
      question: "How is your junk removal pricing determined?",
      answer: "Pricing is primarily based on the volume of space your items take up in our truck. We offer several tiers ranging from a single item up to a full truckload. For heavy materials like concrete or soil, weight-based pricing may apply."
    },
    {
      question: "What items are you unable to take?",
      answer: "While we take most non-hazardous items (furniture, appliances, yard waste, construction debris), we cannot transport hazardous materials such as chemicals, gasoline, paint (unless dried), or bio-medical waste due to environmental regulations."
    },
    {
      question: "What happens to the junk you collect?",
      answer: "We are committed to eco-friendly practices. We sort through all collected items to salvage what can be donated to local Arizona charities and recycle as much as possible at specialized facilities before heading to the landfill."
    },
    {
      question: "Do I need to be present for the removal?",
      answer: "It's preferred so we can confirm the final price and items with you. However, for outdoor pickups (like yard waste or garage cleanouts), we can handle it while you're away as long as we have access and clear instructions."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={fadeIn} 
          initial="initial" 
          whileInView="whileInView" 
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900 mb-6 uppercase tracking-tighter">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 font-medium">Everything you need to know about our local hauling services.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-8 flex items-center justify-between text-left group"
                id={`faq-button-${index}`}
              >
                <span className="text-xl font-display font-black text-gray-900 tracking-tight group-hover:text-teal-600 transition-colors uppercase">{faq.question}</span>
                <div className={`p-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-teal-600 text-white rotate-180' : 'bg-slate-50 text-teal-600 group-hover:bg-teal-50'}`}>
                  <ChevronDown size={24} />
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-gray-600 text-lg leading-relaxed border-t border-slate-50 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          viewport={fadeIn.viewport}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-black text-gray-900 mb-4 tracking-tight uppercase">Our Services</h2>
          <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We provide comprehensive removal solutions tailored to your needs, ensuring every item is handled responsibly.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={staggerContainer.viewport}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {services.map((s, i) => (
            <motion.div 
              key={i}
              variants={{
                ...fadeIn,
                hover: { y: -10 }
              }}
              whileHover="hover"
              onClick={() => navigate(`/service/${s.id}`)}
              className="p-8 rounded-[2.5rem] bg-white border border-gray-200/60 hover:border-teal-500/30 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full cursor-pointer shadow-sm"
            >
              <div className="mb-6 w-16 h-16 bg-teal-600/10 rounded-2xl flex items-center justify-center group-hover:bg-teal-600/20 transition-all duration-300">
                <motion.div
                  variants={{
                    hover: { 
                      rotate: [0, -7, 7, -7, 7, 0],
                      scale: 1.1,
                      transition: { duration: 0.5, ease: "easeInOut" }
                    }
                  }}
                >
                  {s.icon}
                </motion.div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-6 flex-grow">{s.desc}</p>
              
              <div className="mb-8">
                <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4">Common Items:</p>
                <ul className="space-y-2">
                  {s.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="inline-flex items-center gap-2 text-teal-600 font-black text-sm uppercase tracking-wider group/link"
              >
                Learn More
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Schedule",
      desc: "Book online or call us to schedule a convenient time for your removal.",
      icon: <Calendar className="text-white" size={32} />,
      color: "bg-teal-600"
    },
    {
      title: "Get a Quote",
      desc: "We'll provide a transparent, upfront estimate with no hidden fees.",
      icon: <DollarSign className="text-white" size={32} />,
      color: "bg-teal-700"
    },
    {
      title: "We Remove",
      desc: "Our professional team arrives on time and does all the heavy lifting.",
      icon: <Truck className="text-white" size={32} />,
      color: "bg-teal-800"
    },
    {
      title: "Reclaim Your Space",
      desc: "Enjoy your clean, clutter-free environment. We handle the disposal so you can relax.",
      icon: <Recycle className="text-white" size={32} />,
      color: "bg-teal-900"
    }
  ];

  return (
    <section id="process" className="py-16 md:py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          viewport={fadeIn.viewport}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white mb-6 tracking-tight uppercase">How It Works</h2>
          <div className="w-24 h-2 bg-teal-600 mx-auto rounded-full"></div>
          <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Simple, transparent, and stress-free junk removal in four easy steps.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={staggerContainer.viewport}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative"
        >
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Connector Line (Desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-[2px] bg-gray-800 -z-0"></div>
              )}
              
              <div className={`w-32 h-32 ${step.color} rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-teal-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-900 border-4 border-teal-600 rounded-2xl flex items-center justify-center font-black text-teal-400 text-xl shadow-lg">
                  {i + 1}
                </div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {step.icon}
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed px-4 font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ServiceAreas = () => {
  const areas = [
    { name: "Scottsdale", lat: 33.4942, lng: -111.9261 },
    { name: "Paradise Valley", lat: 33.5311, lng: -111.9426 },
    { name: "North Phoenix", lat: 33.6534, lng: -112.0740 },
    { name: "Arcadia", lat: 33.4942, lng: -111.9561 },
    { name: "Sun City", lat: 33.6067, lng: -112.2721 },
    { name: "Glendale", lat: 33.5387, lng: -112.1860 },
    { name: "Surprise", lat: 33.6292, lng: -112.3679 },
    { name: "Norterra", lat: 33.7259, lng: -112.0838 },
    { name: "Peoria", lat: 33.5806, lng: -112.2374 }
  ];

  // Fix Leaflet's default icon issue
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);
  
  return (
    <section id="areas" className="py-16 md:py-24 lg:py-32 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={staggerContainer.viewport}
            className="text-center lg:text-left"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-black mb-8 leading-tight tracking-tighter uppercase"
            >
              We Serve The <span className="text-teal-500 italic">Valley</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed"
            >
              Our team is strategically located to provide same-day or next-day service to our core service areas. We know the neighborhood, and we know how to get the job done right.
            </motion.p>
            
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-16"
            >
              {areas.map((area, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeIn}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="flex items-center gap-4 bg-zinc-900 shadow-xl p-5 md:p-6 rounded-[2rem] border border-zinc-800 transition-all group"
                >
                  <div className="bg-teal-600/10 p-3 rounded-2xl group-hover:bg-teal-600/20 transition-colors">
                    <MapPin className="text-teal-500" size={20} />
                  </div>
                  <span className="font-display font-black uppercase tracking-widest text-xs text-zinc-200">{area.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              className="p-6 md:p-8 bg-teal-600 rounded-[2rem] md:rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 md:gap-8 shadow-2xl shadow-teal-600/20"
            >
              <div className="bg-white/20 p-4 rounded-2xl">
                <Clock className="text-white" size={32} />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-xl md:text-2xl mb-1">Fast Response Time</h4>
                <p className="text-white/90 font-medium">Most jobs completed within 24 hours of booking.</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={scaleIn}
            initial="initial"
            whileInView="whileInView"
            viewport={scaleIn.viewport}
            className="relative h-[350px] md:h-[500px] lg:h-[600px] mt-12 lg:mt-0"
          >
            <div className="absolute inset-0 bg-teal-500/10 blur-[100px] rounded-full" />
            <div className="w-full h-full rounded-[3.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-4 border-zinc-800 relative z-10">
              <MapContainer 
                center={[33.6, -112.1]} 
                zoom={10} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {areas.map((area, i) => (
                  <Marker key={i} position={[area.lat, area.lng]}>
                    <Popup>
                      <div className="font-bold text-teal-600">{area.name}</div>
                      <div className="text-xs text-gray-500">Service Area</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl -z-0"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <motion.div 
        variants={fadeIn}
        initial="initial"
        whileInView="whileInView"
        viewport={fadeIn.viewport}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-teal-600 p-2 rounded-lg">
                <Trash2 className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Remove<span className="text-teal-600">ALL</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              The premier junk removal service in the Phoenix metropolitan area. Professional, reliable, and committed to keeping our community clean.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/services" className="hover:text-teal-500 transition-colors">Services</Link></li>
              <li><Link to="/blog" className="hover:text-teal-500 transition-colors">Environment Blog</Link></li>
              <li><Link to="/about" className="hover:text-teal-500 transition-colors">Transformation</Link></li>
              <li><Link to="/reviews" className="hover:text-teal-500 transition-colors">Reviews</Link></li>
              <li><Link to="/faq" className="hover:text-teal-500 transition-colors">FAQ</Link></li>
              <li><Link to="/callback" className="hover:text-teal-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/areas" className="hover:text-teal-500 transition-colors">Service Areas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-500" />
                (602) 501-4109
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-teal-500" />
                Scottsdale, AZ
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2026 RemoveALL. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

function Home() {
  const { section } = useParams();

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        // Delay slightly to ensure content is rendered
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [section]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <Hero />
      <TransformationSection />
      <Services />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CallbackRequest />
      <ServiceAreas />
      
      {/* CTA Section */}
      <section className="py-20 bg-teal-600 relative overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={staggerContainer.viewport}
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-display font-black text-white mb-6 uppercase">Ready to clear the clutter?</motion.h2>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:6025014109" 
                className="bg-white text-teal-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                <Phone size={24} />
                CALL (602) 501-4109
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#/quote" 
                className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-900 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                BOOK ONLINE
                <ChevronRight size={24} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/service/:serviceId" element={<ServiceDetail />} />
        <Route path="/:section" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

const BlogList = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div variants={fadeIn} initial="initial" animate="whileInView" className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">Environmental Updates & Local Tips</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Staying compliant and eco-friendly across the Phoenix Metro area.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.map((post, i) => (
            <motion.div 
              key={i} 
              variants={fadeIn} 
              initial="initial" 
              animate="whileInView" 
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4 text-xs font-bold text-teal-600 uppercase tracking-widest">
                  <Calendar size={14} />
                  {post.date}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{post.title}</h2>
                <p className="text-gray-600 mb-6 flex-grow">{post.excerpt}</p>
                <button 
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="flex items-center gap-2 text-teal-600 font-black uppercase tracking-wider hover:gap-4 transition-all"
                >
                  Read More <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-gray-400 hover:text-teal-600 font-bold mb-8 transition-colors"
          >
            <ChevronLeft size={20} /> Back to Blog
          </button>
          
          <div className="flex items-center gap-4 mb-6 text-sm font-bold text-teal-600 uppercase tracking-widest">
            <span>{post.author}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{post.date}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-10 leading-tight uppercase tracking-tighter">
            {post.title}
          </h1>
          
          <div className="aspect-video rounded-[3rem] overflow-hidden mb-12 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="prose prose-xl prose-teal max-w-none text-gray-600 leading-relaxed space-y-8">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          
          <div className="mt-20 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 text-center">
            <h3 className="text-3xl font-black text-gray-900 mb-6 uppercase">Ready to clear the clutter?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Get a professional, eco-friendly quote today for your home or business in the Phoenix Metro area.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quote" className="bg-teal-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20">
                Get Instant Quote
              </Link>
              <a href="tel:6025014109" className="bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-all">
                Call (602) 501-4109
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

