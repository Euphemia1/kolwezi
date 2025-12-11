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

export async function getProjects() {
  const projects = await query<Project>("SELECT * FROM projects WHERE is_published = TRUE ORDER BY created_at DESC")
  return projects
}

export async function getStats() {
  const settings = await query<SiteSetting>("SELECT * FROM site_settings")
  const settingsMap: Record<string, string> = {}
  settings.forEach((setting) => {
    settingsMap[setting.setting_key] = setting.setting_value
  })
  return settingsMap
}