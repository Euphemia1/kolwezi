import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const services = await query("SELECT * FROM services ORDER BY sort_order ASC, created_at DESC")
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await execute(
      `INSERT INTO services (id, title, slug, short_description, full_description, icon, featured_image, features, sort_order, is_active) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}