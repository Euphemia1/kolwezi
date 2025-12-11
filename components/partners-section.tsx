import { ScrollAnimation } from "./scroll-animation"

const partners = [
  { name: "Kamoa Copper SA", logo: "/photos/kamoa copper SA.jpeg" },
  { name: "Kamota", logo: "/photos/kamota.jpeg" },
  { name: "Mutanda Mining", logo: "/photos/mutanda mining.jpeg" },
  // { name: "Mining Corp", logo: "/mining-company-logo-simple.jpg" },
  // { name: "Industrial Group", logo: "/industrial-company-logo-simple.jpg" },
  // { name: "Construction Ltd", logo: "/construction-company-logo-simple.jpg" },
]

export function PartnersSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wide uppercase text-lg">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">Our Partners & Clients</h2>
        </ScrollAnimation>

        <div className="flex justify-end">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16 items-center max-w-4xl">
          {partners.map((partner, index) => (
            <ScrollAnimation key={partner.name} delay={index * 50}>
              <div className="flex flex-col items-center justify-center p-8 hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300">
                <img src={partner.logo || "/photos/IMG-20251208-WA0015.jpg"} alt={partner.name} className="max-h-28 w-auto mb-6" />
                <span className="text-base font-medium text-center">{partner.name}</span>
              </div>
            </ScrollAnimation>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
