import { query } from "@/lib/db"

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  full_description: string
  category: string
  client: string
  location: string
  start_date: string
  end_date: string
  status: string
  featured_image: string
  is_featured: boolean
}

export interface SiteSetting {
  setting_key: string
  setting_value: string
}

// Static project data for demonstration
const staticProjects: Project[] = [
  {
    id: "1",
    title: "Kolwezi Mining Facility Expansion",
    slug: "kolwezi-mining-facility",
    description: "Major expansion project for a copper mining facility including new processing infrastructure.",
    full_description: "This comprehensive project involved the expansion of an existing copper mining facility in Kolwezi. Our team delivered new processing infrastructure, upgraded safety systems, and implemented environmental controls to meet international standards.",
    category: "mining",
    client: "Gécamines",
    location: "Kolwezi, Lualaba",
    start_date: "2023-01-15",
    end_date: "2024-06-30",
    status: "completed",
    featured_image: "/photos/IMG-20251208-WA0015.jpg",
    is_featured: true
  },
  {
    id: "2",
    title: "Commercial Complex Development",
    slug: "commercial-complex",
    description: "Multi-story commercial building with modern amenities and sustainable design.",
    full_description: "A modern commercial complex featuring sustainable design principles and energy-efficient systems. The project includes retail spaces, office areas, and parking facilities.",
    category: "construction",
    client: "Private Client",
    location: "Lubumbashi",
    start_date: "2024-03-01",
    end_date: "",
    status: "ongoing",
    featured_image: "/photos/IMG-20251208-WA0016.jpg",
    is_featured: true
  },
  {
    id: "3",
    title: "Mining Equipment Logistics",
    slug: "mining-equipment-logistics",
    description: "Large-scale logistics operation for transporting heavy mining equipment.",
    full_description: "Complex logistics operation involving the transportation of heavy mining equipment across challenging terrain in the DRC. Our team successfully delivered all equipment on schedule.",
    category: "logistics",
    client: "Mining Corporation",
    location: "Kolwezi - Lubumbashi Route",
    start_date: "2023-05-10",
    end_date: "2023-08-20",
    status: "completed",
    featured_image: "/photos/IMG-20251208-WA0017.jpg",
    is_featured: false
  }
]

// Static site settings for demonstration
const staticSettings: Record<string, string> = {
  "company_name": "KMS SARL",
  "company_email": "info@kmssarl.org",
  "company_phone": "+243 XXX XXX XXX",
  "company_address": "Kolwezi, Lualaba Province, Democratic Republic of Congo",
  "hero_title": "Building Tomorrow's Congo Today",
  "hero_subtitle": "Premier construction, mining support, and logistics services in the Democratic Republic of Congo"
}

export async function getProjects() {
  // Temporary fix: return static data instead of querying database
  // const projects = await query<Project>("SELECT * FROM projects WHERE is_published = TRUE ORDER BY created_at DESC")
  // return projects
  return staticProjects
}

export async function getStats() {
  // Temporary fix: return static settings instead of querying database
  // const settings = await query<SiteSetting>("SELECT * FROM site_settings")
  // const settingsMap: Record<string, string> = {}
  // settings.forEach((setting) => {
  //   settingsMap[setting.setting_key] = setting.setting_value
  // })
  // return settingsMap
  return staticSettings
}