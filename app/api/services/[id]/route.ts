import { NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const service = await queryOne("SELECT * FROM services WHERE id = ?", [id])

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    await execute(
      `UPDATE services SET title = ?, slug = ?, short_description = ?, full_description = ?, icon = ?, featured_image = ?, features = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [
        data.title,
        data.slug,
        data.short_description || null,
        data.full_description || null,
        data.icon || null,
        data.featured_image || null,
        JSON.stringify(data.features || []),
        data.sort_order || 0,
        data.is_active ? 1 : 0,
        id,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await execute("DELETE FROM services WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}