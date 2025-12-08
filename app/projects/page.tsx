"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { query } from "@/lib/db"
import { ProjectsPageClient } from "@/components/projects-page-client"

interface Project {
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

interface SiteSetting {
  setting_key: string
  setting_value: string
}

async function getProjects() {
  const projects = await query<Project>("SELECT * FROM projects WHERE is_published = TRUE ORDER BY created_at DESC")
  return projects
}

async function getStats() {
  const settings = await query<SiteSetting>("SELECT * FROM site_settings")
  const settingsMap: Record<string, string> = {}
  settings.forEach((setting) => {
    settingsMap[setting.setting_key] = setting.setting_value
  })
  return settingsMap
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const stats = await getStats()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Our Projects</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Building <span className="text-primary">Excellence</span> Across DRC
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our portfolio of successfully completed and ongoing projects across construction, mining,
              logistics, and infrastructure sectors.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Projects Client Component */}
      <ProjectsPageClient projects={projects} stats={stats} />

      <Footer />
    </main>
  )
}
