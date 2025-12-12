import { queryOne } from "@/lib/db"
import { ServicesForm } from "@/components/admin/services-form"
import { notFound } from "next/navigation"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  featured_image: string
  features: string
  sort_order: number
  is_active: boolean
}

async function getService(id: string) {
  const service = await queryOne<Service>("SELECT * FROM services WHERE id = ?", [id])
  if (service) {
    return {
      ...service,
      features: typeof service.features === "string" ? JSON.parse(service.features) : service.features || [],
    }
  }
  return null
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getService(id)

  if (!service) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground">Update service details</p>
      </div>
      <ServicesForm service={service} />
    </div>
  )
}