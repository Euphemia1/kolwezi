import { ScrollAnimation } from "./scroll-animation"

const partners = [
  { name: "Mining Corp", logo: "/mining-company-logo-simple.jpg" },
  { name: "Industrial Group", logo: "/industrial-company-logo-simple.jpg" },
  { name: "Construction Ltd", logo: "/construction-company-logo-simple.jpg" },
  { name: "Logistics Pro", logo: "/logistics-company-logo-simple.jpg" },
  { name: "Energy Solutions", logo: "/energy-company-logo-simple.jpg" },
  { name: "Tech Industries", logo: "/technology-company-logo-simple.jpg" },
]

export function PartnersSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-4">Our Partners & Clients</h2>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <ScrollAnimation key={partner.name} delay={index * 50}>
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <img src={partner.logo || "/photos/IMG-20251208-WA0015.jpg"} alt={partner.name} className="max-h-12 w-auto" />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
