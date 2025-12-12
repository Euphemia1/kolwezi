import { query } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  title: string
  short_description: string
  is_active: boolean
  sort_order: number
  created_at: string
}

async function getServices() {
  const services = await query<Service>("SELECT * FROM services ORDER BY sort_order ASC, created_at DESC")
  return services
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your company services and offerings</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No services yet</p>
            <Button asChild>
              <Link href="/admin/services/new">Create your first service</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.short_description}</CardDescription>
                  </div>
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" /> Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" /> Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Sort Order: {service.sort_order}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/services/${service.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}