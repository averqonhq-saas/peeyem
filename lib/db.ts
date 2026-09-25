import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDb, isFirebaseConfigured } from "./firebase";
import {
  DbProduct,
  DbTestimonial,
  DbPromotionVideo,
  DbEnquiry,
  AdminMediaAsset,
  DbGalleryImage,
  EnquiryStatus,
} from "@/types/admin";
import { PRODUCTS } from "@/data/products";
import { parseYouTubeUrl } from "./youtube";

// Initial Seed Data with requested schema fields
const INITIAL_PRODUCTS: DbProduct[] = PRODUCTS.map((p, idx) => ({
  id: p.id,
  name: p.name,
  slug: p.id,
  category_id: p.categoryTag,
  short_description: p.description,
  description: `${p.description} Engineered to withstand continuous tensile stress, high impact loads, and abrasive materials encountered in heavy industrial quarry and plant applications.`,
  image_url: p.image,
  price_range: "₹850 - ₹1,850 / meter",
  specifications: [
    { key: "Standard", value: p.specTag },
    { key: "Carcass Grade", value: p.categoryTag },
    { key: "Tensile Strength", value: "315 N/mm to 2000 N/mm" },
    { key: "Cover Grade", value: "M-24, N-17, HR, SHR" },
  ],
  is_active: true,
  is_featured: idx < 3,
  display_order: idx + 1,
  created_at: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
  updated_at: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
}));

const INITIAL_TESTIMONIALS: DbTestimonial[] = [];

const INITIAL_VIDEOS: DbPromotionVideo[] = [
  {
    id: "vid-1",
    title: "Heavy Duty Fabric Conveyor Belting Splicing & Jointing",
    youtube_url: "https://www.youtube.com/watch?v=W1YV5piOBmw",
    youtube_video_id: "W1YV5piOBmw",
    thumbnail_url: "https://img.youtube.com/vi/W1YV5piOBmw/hqdefault.jpg",
    embed_url: "https://www.youtube.com/embed/W1YV5piOBmw?rel=0",
    description: "Step-by-step industrial fabric conveyor belt splicing and vulcanization procedure for heavy aggregate transport lines.",
    size: "wide",
    is_active: true,
    is_featured: true,
    display_order: 1,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "vid-2",
    title: "Industrial Conveyor Belt Hot Press Vulcanizing",
    youtube_url: "https://www.youtube.com/watch?v=yPYZpwSpKmA",
    youtube_video_id: "yPYZpwSpKmA",
    thumbnail_url: "https://img.youtube.com/vi/yPYZpwSpKmA/hqdefault.jpg",
    embed_url: "https://www.youtube.com/embed/yPYZpwSpKmA?rel=0",
    description: "Factory technicians executing mechanical and hot press vulcanizing splicing for heavy tensile belting at our Coimbatore depot.",
    size: "standard",
    is_active: true,
    is_featured: false,
    display_order: 2,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "vid-3",
    title: "Industrial Rubber & PVC Conveyor Belt Manufacturing",
    youtube_url: "https://www.youtube.com/watch?v=tCne0Gwgczs",
    youtube_video_id: "tCne0Gwgczs",
    thumbnail_url: "https://img.youtube.com/vi/tCne0Gwgczs/hqdefault.jpg",
    embed_url: "https://www.youtube.com/embed/tCne0Gwgczs?rel=0",
    description: "Automated calender curing and multi-ply fabric reinforcement manufacturing for high tensile industrial belting.",
    size: "compact",
    is_active: true,
    is_featured: false,
    display_order: 3,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const INITIAL_ENQUIRIES: DbEnquiry[] = [
  {
    id: "enq-101",
    name: "Arun Kumar",
    phone: "+91 94433 51280",
    email: "arunkumar.quarry@gmail.com",
    subject: "Bulk Chevron Belt Order",
    product_id: "chevron-belts",
    message: "We need 120 meters of 800mm width 3-ply chevron belting with 15mm cleats for our aggregate screen conveyor. Please provide pricing and delivery timeline to Karur.",
    status: "NEW",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "enq-102",
    name: "K. Mohanraj",
    phone: "+91 98432 19876",
    email: "mohanraj@velanmining.in",
    subject: "Hot Jointing & Fasteners",
    product_id: "belt-fasteners",
    message: "Urgent quote needed for 14# plate fasteners (5 boxes) and 100 meters of skirt rubber 10mm thickness.",
    status: "CONTACTED",
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    notes: "Spoke on phone at 4 PM. Sent technical quote on WhatsApp.",
  },
  {
    id: "enq-103",
    name: "Priya Sundaram",
    phone: "+91 98422 73190",
    email: "priya@sundaramfoods.in",
    subject: "White PVC Food Grade Belting",
    product_id: "industrial-belts",
    message: "Require 40 meters of FDA approved food grade white conveyor belt for bakery cooling line.",
    status: "CLOSED",
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    notes: "Order fulfilled and dispatched via local freight.",
  },
];

const INITIAL_MEDIA: AdminMediaAsset[] = [
  {
    id: "med-1",
    name: "conveyor-roll-main.jpg",
    url: PRODUCTS[0].image,
    sizeBytes: 184500,
    format: "jpg",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "med-2",
    name: "chevron-pattern-macro.jpg",
    url: PRODUCTS[1].image,
    sizeBytes: 212400,
    format: "jpg",
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: "med-3",
    name: "rubber-sheet-stack.jpg",
    url: PRODUCTS[2].image,
    sizeBytes: 198300,
    format: "jpg",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

const INITIAL_GALLERY_IMAGES: DbGalleryImage[] = [
  {
    id: "gal-1",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgqOYZAdlPsSXp8KRxib9a55ZCWgAEiemhK7uh5ijWHxzXlOav-Mg0yOoE5kNo0biwJvY_Y8XOZiIZxRNCTBJJlN6IbNI_Y2WmnHvQOqZK4F5OfaLPillUb3dsWv5_UcraxLEZCcVffhdSFoVddQqnqf1R-hy9zXRISaU0VjA9iSR2UMe5n5nP5UtZfbsz0hnjCFB0_QJi0vTontyB6GxmAKdvHq8Vf1xWNhafprxP-YgoJaO_fzgFqg",
    caption: "Chevron Cleated High-Angle Roll Assembly",
    category: "products",
    display_order: 1,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "gal-2",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkBo8yqVorpCynzioX_BBPHgU0JBhLzroHNbWerJok2IBjlVxe4a19F0hwSjJA_A-u7VEHV7_GNP1j1Z-fag9ZLHgSlcIBTXIvWaE7LyR9c-DXY5JtZoI1MRpj2sW9jev62dt1NU7MZnHWs_B6w-LR6R4el0ls06totDAeYn18QkRVZTWEqH9JtH4qV3ViWwT0nKK3UCamfWnqm4VKDkuBCtKnLRDSIF-b_KlqPOTF_bnwcjzgdyX5kA",
    caption: "Industrial Rubber Sheeting Warehouse Staging",
    category: "depots",
    display_order: 2,
    is_active: true,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "gal-3",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsKPWW63Qi05s9yRq3dC3WVHs1pOGgG0no6Y3MjGLi_56i0E1p8zpaO-7kfsFuv-Yu9neJZLOpXrIh1susAFnE3H20RCCAK3PHgnuxHqsSUbK5IS2q4a-wD3S4tfBzjGn7Ym2wtX8XA39E11B22DsUBsig1bjBhoX4tg-KUhjsgYSqQBbuWbtAQ7M5IoOIYH-xVrt7jPc0EAKyrkYJGotMwTFgZ7OAMseRPhlvdB9xKByme5YgQppGuA",
    caption: "Granite Aggregate Primary Crushing Line",
    category: "field",
    display_order: 3,
    is_active: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "gal-4",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEFx7k55IA317wq6EHUhLVmbSA3ZIzfHPhO5hEOz0wHiSUJQ4E92SFzJc_XbeT3uDxrCRorkiaOe_ljIId4g3PdoPG2Kk2bZOsyZ5x5_IyWW_Rv921lBFU2Xj53elmi1iMQ4rd_k-6ECgOgit-5H0otzoyaAWhFhyR6uAw1yM0MKTP-JaFqT-oR8XHc0n3sHz39MMSIYjcqPZFaipoPUTeknJraGhUtyKLaem4GS3kIBzFNki_55xMHw",
    caption: "Multi-Ply Flat Carcass Belting Inventory",
    category: "products",
    display_order: 4,
    is_active: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "gal-5",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3_buoWxyGzU0ywanzn2SfpTbj0BG58YmEAibe81SezkIC7p66a6YkCyZ0LMP8DWviLA-Volznrco0P2Jf_nlYKKp5UL2prH6f9WDqEZoMA8HJ0wrdy3ds67awsVVChnVIh3A9E8SUuRF1Ih_Piqb28KHxd79W7Wm9ekOz0s2MmJWRwItkAG8H2zsAPgelghoyQs9Ay_Wgy88mNzg7jNVmH1hzafBNkmVwr-PpIKQa95hHAUpIg4gXDA",
    caption: "Steep-Angle Conveyor Cleat Adhesion Detail",
    category: "equipment",
    display_order: 5,
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "gal-6",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs7yTSXlzcVax7PnNCQvjTa6XDREv5oH9E4W48DlxLVJNI8q_qpUogVXA1GT3kf76303hv0Xn82TgcRTpxxZTGo2xwXWNzbDUXOaRmXBQwx50MKroHRm4VWUr9s15xjl3Y-QWEamUWSHLIlt31KZKr4PxznfDzpxama7jNdbiFJHD-_J2al4GYniaTi5SLn-q1S7-Hn-yUj1HJ3HBkDRzLT-iwxELFZtmMVvxN1vtpFKDwcMig2Lcx-A",
    caption: "Heavy Wear Natural Rubber Lining Rolls",
    category: "depots",
    display_order: 6,
    is_active: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "gal-7",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9rZd_mnTr1CTvZzvMWgYHLE-fO1KLDn09VkqIpMT7bB2Aq84j2fJIBWl9laruoBVrr2U0OSIZVip_nG_aqmktotIPeTa2_gpc6gKMIeN1NB1-RIR9bpth9qRPOSjwN631vQI_AQm7FbVdcTGhr144nwPrVYAgEgdCgfC5IHR0HI0XGQ14Zj38hzyqvkvIuhxPcVDenMUlbyymmH_ifNDyox6aM1nrcueDlKVNjtxm",
    caption: "South Ukkadam Central Slitting Depot",
    category: "depots",
    display_order: 7,
    is_active: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// Cross-tab real-time event synchronization channel
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    syncChannel = new BroadcastChannel("peeyem_data_sync");
  } catch (e) {
    console.warn("BroadcastChannel not supported, falling back to storage listener");
  }
}

function broadcastSync(topic: "products" | "testimonials" | "videos" | "enquiries" | "media" | "gallery_images") {
  if (typeof window === "undefined") return;
  try {
    syncChannel?.postMessage({ topic, timestamp: Date.now() });
    // Trigger storage event for tabs
    localStorage.setItem(`peeyem_sync_${topic}`, Date.now().toString());
  } catch (e) {
    console.warn("Broadcast error:", e);
  }
}

// LocalStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`peeyem_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`peeyem_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// Unified Database Service & Real-Time Sync Engine
export const dbService = {
  // ==========================================
  // REAL-TIME SUBSCRIPTIONS
  // ==========================================

  subscribeProducts(callback: (products: DbProduct[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    // Initial load
    this.getProducts().then(callback);

    let unsubscribeFirestore = () => {};

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "products"), orderBy("display_order", "asc"));
        unsubscribeFirestore = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbProduct));
              callback(list);
            }
          },
          (err) => console.warn("Firestore products onSnapshot warning:", err)
        );
      } catch (err) {
        console.warn("Firestore subscribe error:", err);
      }
    }

    // Cross-tab broadcast listener
    const handleBroadcast = (msg: MessageEvent) => {
      if (msg.data?.topic === "products") {
        this.getProducts().then(callback);
      }
    };
    syncChannel?.addEventListener("message", handleBroadcast);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "peeyem_sync_products" || e.key === "peeyem_products") {
        this.getProducts().then(callback);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribeFirestore();
      syncChannel?.removeEventListener("message", handleBroadcast);
      window.removeEventListener("storage", handleStorage);
    };
  },

  subscribeTestimonials(callback: (testimonials: DbTestimonial[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    this.getTestimonials().then(callback);

    let unsubscribeFirestore = () => {};

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "testimonials"), orderBy("display_order", "asc"));
        unsubscribeFirestore = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbTestimonial));
              callback(list);
            }
          },
          (err) => console.warn("Firestore testimonials onSnapshot warning:", err)
        );
      } catch (err) {
        console.warn("Firestore subscribe error:", err);
      }
    }

    const handleBroadcast = (msg: MessageEvent) => {
      if (msg.data?.topic === "testimonials") {
        this.getTestimonials().then(callback);
      }
    };
    syncChannel?.addEventListener("message", handleBroadcast);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "peeyem_sync_testimonials" || e.key === "peeyem_testimonials") {
        this.getTestimonials().then(callback);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribeFirestore();
      syncChannel?.removeEventListener("message", handleBroadcast);
      window.removeEventListener("storage", handleStorage);
    };
  },

  subscribeVideos(callback: (videos: DbPromotionVideo[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    this.getVideos().then(callback);

    let unsubscribeFirestore = () => {};

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "videos"), orderBy("display_order", "asc"));
        unsubscribeFirestore = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbPromotionVideo));
              callback(list);
            }
          },
          (err) => console.warn("Firestore videos onSnapshot warning:", err)
        );
      } catch (err) {
        console.warn("Firestore subscribe error:", err);
      }
    }

    const handleBroadcast = (msg: MessageEvent) => {
      if (msg.data?.topic === "videos") {
        this.getVideos().then(callback);
      }
    };
    syncChannel?.addEventListener("message", handleBroadcast);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "peeyem_sync_videos" || e.key === "peeyem_videos") {
        this.getVideos().then(callback);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribeFirestore();
      syncChannel?.removeEventListener("message", handleBroadcast);
      window.removeEventListener("storage", handleStorage);
    };
  },

  subscribeEnquiries(callback: (enquiries: DbEnquiry[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    this.getEnquiries().then(callback);

    let unsubscribeFirestore = () => {};

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "enquiries"), orderBy("created_at", "desc"));
        unsubscribeFirestore = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbEnquiry));
              callback(list);
            }
          },
          (err) => console.warn("Firestore enquiries onSnapshot warning:", err)
        );
      } catch (err) {
        console.warn("Firestore subscribe error:", err);
      }
    }

    const handleBroadcast = (msg: MessageEvent) => {
      if (msg.data?.topic === "enquiries") {
        this.getEnquiries().then(callback);
      }
    };
    syncChannel?.addEventListener("message", handleBroadcast);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "peeyem_sync_enquiries" || e.key === "peeyem_enquiries") {
        this.getEnquiries().then(callback);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribeFirestore();
      syncChannel?.removeEventListener("message", handleBroadcast);
      window.removeEventListener("storage", handleStorage);
    };
  },

  // ==========================================
  // PRODUCTS CRUD
  // ==========================================

  async getProducts(): Promise<DbProduct[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snap = await getDocs(collection(firestoreDb, "products"));
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbProduct));
          return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        } else {
          // Firestore collection is empty: seed initial products into Firestore
          for (const p of INITIAL_PRODUCTS) {
            await setDoc(doc(firestoreDb, "products", p.id), p, { merge: true });
          }
          return INITIAL_PRODUCTS;
        }
      } catch (e) {
        console.warn("Firestore products getDocs fallback:", e);
      }
    }
    const local = getLocal<DbProduct[]>("products", INITIAL_PRODUCTS);
    return [...local].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  async addProduct(data: Omit<DbProduct, "id" | "created_at" | "updated_at">): Promise<DbProduct> {
    const now = new Date().toISOString();
    const id = data.slug || "prod-" + Date.now();
    const item: DbProduct = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "products", id), {
          ...item,
          created_at: now,
          updated_at: now,
        });
      } catch (e) {
        console.warn("Firestore addProduct error:", e);
      }
    }

    const current = getLocal<DbProduct[]>("products", INITIAL_PRODUCTS);
    setLocal("products", [item, ...current]);
    broadcastSync("products");
    return item;
  },

  async updateProduct(id: string, updates: Partial<DbProduct>): Promise<DbProduct> {
    const now = new Date().toISOString();

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(
          doc(firestoreDb, "products", id),
          {
            ...updates,
            updated_at: now,
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Firestore updateProduct error:", e);
      }
    }

    const current = getLocal<DbProduct[]>("products", INITIAL_PRODUCTS);
    let updated: DbProduct | null = null;
    const next = current.map((p) => {
      if (p.id === id) {
        updated = { ...p, ...updates, updated_at: now };
        return updated;
      }
      return p;
    });
    setLocal("products", next);
    broadcastSync("products");
    return updated || ({ id, ...updates } as DbProduct);
  },

  async deleteProduct(id: string): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "products", id));
      } catch (e) {
        console.warn("Firestore deleteProduct error:", e);
      }
    }
    const current = getLocal<DbProduct[]>("products", INITIAL_PRODUCTS);
    setLocal("products", current.filter((p) => p.id !== id));
    broadcastSync("products");
  },

  // ==========================================
  // TESTIMONIALS CRUD
  // ==========================================

  async getTestimonials(): Promise<DbTestimonial[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snap = await getDocs(collection(firestoreDb, "testimonials"));
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbTestimonial));
          return list
            .filter((t) => !["test-1", "test-2", "test-3"].includes(t.id))
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        }
      } catch (e) {
        console.warn("Firestore testimonials error:", e);
      }
    }
    const local = getLocal<DbTestimonial[]>("testimonials", INITIAL_TESTIMONIALS);
    const cleaned = local.filter((t) => !["test-1", "test-2", "test-3"].includes(t.id));
    if (cleaned.length !== local.length) {
      setLocal("testimonials", cleaned);
      broadcastSync("testimonials");
    }
    return [...cleaned].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  async addTestimonial(data: Omit<DbTestimonial, "id" | "created_at" | "updated_at">): Promise<DbTestimonial> {
    const now = new Date().toISOString();
    const id = "test-" + Date.now();

    let youtube_video_id = data.youtube_video_id;
    let embed_url = data.embed_url;
    let thumbnail_url = data.thumbnail_url;

    if (data.youtube_url && (!embed_url || !thumbnail_url)) {
      const parsed = parseYouTubeUrl(data.youtube_url);
      if (parsed) {
        youtube_video_id = parsed.videoId;
        embed_url = parsed.embedUrl;
        thumbnail_url = parsed.thumbnailHqUrl || parsed.thumbnailUrl;
      }
    }

    const item: DbTestimonial = {
      ...data,
      youtube_video_id,
      embed_url,
      thumbnail_url,
      id,
      created_at: now,
      updated_at: now,
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "testimonials", id), item);
      } catch (e) {
        console.warn("Firestore addTestimonial error:", e);
      }
    }

    const current = getLocal<DbTestimonial[]>("testimonials", INITIAL_TESTIMONIALS);
    setLocal("testimonials", [...current, item]);
    broadcastSync("testimonials");
    return item;
  },

  async updateTestimonial(id: string, updates: Partial<DbTestimonial>): Promise<DbTestimonial> {
    const now = new Date().toISOString();
    const enrichedUpdates = { ...updates };

    if (updates.youtube_url) {
      const parsed = parseYouTubeUrl(updates.youtube_url);
      if (parsed) {
        enrichedUpdates.youtube_video_id = parsed.videoId;
        enrichedUpdates.embed_url = parsed.embedUrl;
        enrichedUpdates.thumbnail_url = parsed.thumbnailHqUrl || parsed.thumbnailUrl;
      }
    }

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "testimonials", id), { ...enrichedUpdates, updated_at: now }, { merge: true });
      } catch (e) {
        console.warn("Firestore updateTestimonial error:", e);
      }
    }

    const current = getLocal<DbTestimonial[]>("testimonials", INITIAL_TESTIMONIALS);
    let updated: DbTestimonial | null = null;
    const next = current.map((t) => {
      if (t.id === id) {
        updated = { ...t, ...enrichedUpdates, updated_at: now };
        return updated;
      }
      return t;
    });
    setLocal("testimonials", next);
    broadcastSync("testimonials");
    return updated || ({ id, ...updates } as DbTestimonial);
  },

  async deleteTestimonial(id: string): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "testimonials", id));
      } catch (e) {
        console.warn("Firestore deleteTestimonial error:", e);
      }
    }
    const current = getLocal<DbTestimonial[]>("testimonials", INITIAL_TESTIMONIALS);
    setLocal("testimonials", current.filter((t) => t.id !== id));
    broadcastSync("testimonials");
  },

  // ==========================================
  // PROMOTION VIDEOS CRUD
  // ==========================================

  async getVideos(): Promise<DbPromotionVideo[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snap = await getDocs(collection(firestoreDb, "videos"));
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbPromotionVideo));
          return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        } else {
          for (const v of INITIAL_VIDEOS) {
            await setDoc(doc(firestoreDb, "videos", v.id), v, { merge: true });
          }
          return INITIAL_VIDEOS;
        }
      } catch (e) {
        console.warn("Firestore videos error:", e);
      }
    }
    const local = getLocal<DbPromotionVideo[]>("videos", INITIAL_VIDEOS);
    const enriched = local.map((v) => {
      // Migrate legacy Rickroll dummy or outdated video
      if (v.youtube_video_id === "dQw4w9WgXcQ" || v.youtube_url?.includes("dQw4w9WgXcQ")) {
        const init = INITIAL_VIDEOS.find((iv) => iv.id === v.id);
        if (init) return { ...v, ...init };
      }
      if (!v.size) {
        const init = INITIAL_VIDEOS.find((iv) => iv.id === v.id);
        return { ...v, size: init?.size || "wide" };
      }
      return v;
    });
    return [...enriched].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  async addVideo(data: Omit<DbPromotionVideo, "id" | "created_at" | "updated_at">): Promise<DbPromotionVideo> {
    const now = new Date().toISOString();
    const id = "vid-" + Date.now();
    const item: DbPromotionVideo = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "videos", id), item);
      } catch (e) {
        console.warn("Firestore addVideo error:", e);
      }
    }

    const current = getLocal<DbPromotionVideo[]>("videos", INITIAL_VIDEOS);
    setLocal("videos", [item, ...current]);
    broadcastSync("videos");
    return item;
  },

  async updateVideo(id: string, updates: Partial<DbPromotionVideo>): Promise<DbPromotionVideo> {
    const now = new Date().toISOString();

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "videos", id), { ...updates, updated_at: now }, { merge: true });
      } catch (e) {
        console.warn("Firestore updateVideo error:", e);
      }
    }

    const current = getLocal<DbPromotionVideo[]>("videos", INITIAL_VIDEOS);
    let updated: DbPromotionVideo | null = null;
    const next = current.map((v) => {
      if (v.id === id) {
        updated = { ...v, ...updates, updated_at: now };
        return updated;
      }
      return v;
    });
    setLocal("videos", next);
    broadcastSync("videos");
    return updated || ({ id, ...updates } as DbPromotionVideo);
  },

  async deleteVideo(id: string): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "videos", id));
      } catch (e) {
        console.warn("Firestore deleteVideo error:", e);
      }
    }
    const current = getLocal<DbPromotionVideo[]>("videos", INITIAL_VIDEOS);
    setLocal("videos", current.filter((v) => v.id !== id));
    broadcastSync("videos");
  },

  // ==========================================
  // ENQUIRIES CRUD
  // ==========================================

  async getEnquiries(): Promise<DbEnquiry[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snap = await getDocs(collection(firestoreDb, "enquiries"));
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbEnquiry));
          return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else {
          for (const eq of INITIAL_ENQUIRIES) {
            await setDoc(doc(firestoreDb, "enquiries", eq.id), eq, { merge: true });
          }
          return INITIAL_ENQUIRIES;
        }
      } catch (e) {
        console.warn("Firestore enquiries error:", e);
      }
    }
    const local = getLocal<DbEnquiry[]>("enquiries", INITIAL_ENQUIRIES);
    const enriched = local.map((e) => {
      if (e.phone === "9876543210" || e.phone === "9798765432") {
        const init = INITIAL_ENQUIRIES.find((ie) => ie.id === e.id);
        if (init) return { ...e, ...init };
      }
      return e;
    });
    return [...enriched].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async addEnquiry(data: Omit<DbEnquiry, "id" | "created_at" | "updated_at" | "status"> & { status?: EnquiryStatus }): Promise<DbEnquiry> {
    const now = new Date().toISOString();
    const id = "enq-" + Date.now();
    const item: DbEnquiry = {
      ...data,
      status: data.status || "NEW",
      id,
      created_at: now,
      updated_at: now,
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "enquiries", id), item);
      } catch (e) {
        console.warn("Firestore addEnquiry error:", e);
      }
    }

    const current = getLocal<DbEnquiry[]>("enquiries", INITIAL_ENQUIRIES);
    setLocal("enquiries", [item, ...current]);
    broadcastSync("enquiries");
    return item;
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): Promise<DbEnquiry> {
    const now = new Date().toISOString();
    const updates: Partial<DbEnquiry> = { status, updated_at: now };
    if (notes !== undefined) updates.notes = notes;

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "enquiries", id), updates, { merge: true });
      } catch (e) {
        console.warn("Firestore updateEnquiryStatus error:", e);
      }
    }

    const current = getLocal<DbEnquiry[]>("enquiries", INITIAL_ENQUIRIES);
    let updated: DbEnquiry | null = null;
    const next = current.map((e) => {
      if (e.id === id) {
        updated = { ...e, ...updates };
        return updated;
      }
      return e;
    });
    setLocal("enquiries", next);
    broadcastSync("enquiries");
    return updated || ({ id, status, notes } as DbEnquiry);
  },

  async deleteEnquiry(id: string): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "enquiries", id));
      } catch (e) {
        console.warn("Firestore deleteEnquiry error:", e);
      }
    }
    const current = getLocal<DbEnquiry[]>("enquiries", INITIAL_ENQUIRIES);
    setLocal("enquiries", current.filter((e) => e.id !== id));
    broadcastSync("enquiries");
  },

  // ==========================================
  // GALLERY IMAGES
  // ==========================================

  async getGalleryImages(): Promise<DbGalleryImage[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "gallery_images"), orderBy("display_order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbGalleryImage));
        }
      } catch (e) {
        console.warn("Firestore getGalleryImages error:", e);
      }
    }
    return getLocal<DbGalleryImage[]>("gallery_images", INITIAL_GALLERY_IMAGES);
  },

  subscribeGalleryImages(callback: (list: DbGalleryImage[]) => void): () => void {
    this.getGalleryImages().then(callback);

    let unsubscribeFirestore = () => {};
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "gallery_images"), orderBy("display_order", "asc"));
        unsubscribeFirestore = onSnapshot(
          q,
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbGalleryImage));
            callback(list);
          },
          (err) => console.warn("gallery_images onSnapshot:", err)
        );
      } catch (e) {
        console.warn("Firestore subscribeGalleryImages error:", e);
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "peeyem_gallery_images") this.getGalleryImages().then(callback);
    };
    if (typeof window !== "undefined") window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribeFirestore();
      if (typeof window !== "undefined") window.removeEventListener("storage", handleStorage);
    };
  },

  async addGalleryImage(
    data: Omit<DbGalleryImage, "id" | "created_at" | "updated_at">
  ): Promise<DbGalleryImage> {
    const now = new Date().toISOString();
    const id = "gal-" + Date.now();
    const item: DbGalleryImage = { ...data, id, created_at: now, updated_at: now };
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "gallery_images", id), item);
      } catch (e) {
        console.warn("Firestore addGalleryImage error:", e);
      }
    }
    const current = getLocal<DbGalleryImage[]>("gallery_images", INITIAL_GALLERY_IMAGES);
    setLocal("gallery_images", [...current, item].sort((a, b) => a.display_order - b.display_order));
    broadcastSync("gallery_images");
    return item;
  },

  async updateGalleryImage(id: string, data: Partial<DbGalleryImage>): Promise<void> {
    const now = new Date().toISOString();
    const updated = { ...data, updated_at: now };
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "gallery_images", id), updated, { merge: true });
      } catch (e) {
        console.warn("Firestore updateGalleryImage error:", e);
      }
    }
    const current = getLocal<DbGalleryImage[]>("gallery_images", INITIAL_GALLERY_IMAGES);
    setLocal(
      "gallery_images",
      current.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
    broadcastSync("gallery_images");
  },

  async deleteGalleryImage(id: string): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "gallery_images", id));
      } catch (e) {
        console.warn("Firestore deleteGalleryImage error:", e);
      }
    }
    const current = getLocal<DbGalleryImage[]>("gallery_images", INITIAL_GALLERY_IMAGES);
    setLocal("gallery_images", current.filter((g) => g.id !== id));
    broadcastSync("gallery_images");
  },

  // ==========================================
  // MEDIA ASSETS
  // ==========================================

  async getMedia(): Promise<AdminMediaAsset[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const snap = await getDocs(collection(firestoreDb, "media"));
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminMediaAsset));
        }
      } catch (e) {
        console.warn("Firestore media error:", e);
      }
    }
    return getLocal<AdminMediaAsset[]>("media", INITIAL_MEDIA);
  },

  async addMedia(data: Omit<AdminMediaAsset, "id" | "createdAt">): Promise<AdminMediaAsset> {
    const now = new Date().toISOString();
    const item: AdminMediaAsset = {
      ...data,
      id: "med-" + Date.now(),
      createdAt: now,
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "media", item.id), item);
      } catch (e) {
        console.warn("Firestore addMedia error:", e);
      }
    }

    const current = getLocal<AdminMediaAsset[]>("media", INITIAL_MEDIA);
    setLocal("media", [item, ...current]);
    broadcastSync("media");
    return item;
  },

  async deleteMedia(id: string): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "media", id));
      } catch (e) {
        console.warn("Firestore deleteMedia error:", e);
      }
    }
    const current = getLocal<AdminMediaAsset[]>("media", INITIAL_MEDIA);
    setLocal("media", current.filter((m) => m.id !== id));
    broadcastSync("media");
  },

  // RESET / RE-SEED
  async resetSampleData(): Promise<void> {
    setLocal("products", INITIAL_PRODUCTS);
    setLocal("testimonials", INITIAL_TESTIMONIALS);
    setLocal("videos", INITIAL_VIDEOS);
    setLocal("enquiries", INITIAL_ENQUIRIES);
    setLocal("media", INITIAL_MEDIA);
    setLocal("gallery_images", INITIAL_GALLERY_IMAGES);
    broadcastSync("products");
    broadcastSync("testimonials");
    broadcastSync("videos");
    broadcastSync("enquiries");
    broadcastSync("gallery_images");
    if (isFirebaseConfigured && firestoreDb) {
      await this.syncSeedToFirestore();
    }
  },

  // Manual or automatic sync of seed data directly to Firestore collections
  async syncSeedToFirestore(): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseConfigured || !firestoreDb) {
      return { success: false, message: "Firebase is not configured in .env.local" };
    }
    try {
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(firestoreDb, "products", p.id), p, { merge: true });
      }
      for (const t of INITIAL_TESTIMONIALS) {
        await setDoc(doc(firestoreDb, "testimonials", t.id), t, { merge: true });
      }
      for (const v of INITIAL_VIDEOS) {
        await setDoc(doc(firestoreDb, "videos", v.id), v, { merge: true });
      }
      for (const e of INITIAL_ENQUIRIES) {
        await setDoc(doc(firestoreDb, "enquiries", e.id), e, { merge: true });
      }
      for (const g of INITIAL_GALLERY_IMAGES) {
        await setDoc(doc(firestoreDb, "gallery_images", g.id), g, { merge: true });
      }
      return {
        success: true,
        message: "Successfully stored and synced all data to live Firestore collections!",
      };
    } catch (err: any) {
      console.error("Firestore syncSeed error:", err);
      return { success: false, message: err.message || "Failed to store data in Firestore." };
    }
  },
};
