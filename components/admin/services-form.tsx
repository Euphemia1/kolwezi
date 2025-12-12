"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface Service {
  id?: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  featured_image: string
  features: string[]
  sort_order: number
  is_active: boolean
}

const defaultService: Service = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  icon: "",
  featured_image: "",
  features: [""],
  sort_order: 0,
  is_active: true,
}

export function ServicesForm({ service }: { service?: Service }) {
  const [formData, setFormData] = useState<Service>(service || defaultService)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!service?.id

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }))
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dataToSave = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ""),
      }

      const url = isEditing ? `/api/services/${service.id}` : "/api/services"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save service")
      }

      router.push("/admin/services")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="active" className="text-sm">
              Active
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditing ? "Update" : "Create"} Service
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input id="title" value={formData.title} onChange={handleTitleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, full_description: e.target.value }))}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature..."
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon Class</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., wrench, building, truck"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="featured_image">Image URL</Label>
                <Input
                  id="featured_image"
                  type="url"
                  placeholder="https://..."
                  value={formData.featured_image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                />
                {formData.featured_image && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}