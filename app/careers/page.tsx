import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Heart, Zap, Users, Briefcase } from "lucide-react"
import { JobsList } from "@/components/jobs-list"
import { ApplicationForm } from "@/components/application-form"

const benefits = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical coverage for you and your family" },
  { icon: Zap, title: "Career Growth", description: "Continuous training and advancement opportunities" },
  { icon: Users, title: "Great Team", description: "Work alongside industry experts and professionals" },
  { icon: Briefcase, title: "Competitive Pay", description: "Market-leading salaries and performance bonuses" },
]

// Static job data for demonstration
const staticJobs = [
  {
    id: "1",
    title: "Senior Civil Engineer",
    slug: "senior-civil-engineer",
    department: "Engineering",
    location: "Kolwezi, DRC",
    employment_type: "Full-time",
    experience_level: "Senior",
    description: "We are seeking an experienced Civil Engineer to lead major construction projects and mentor junior team members.",
    requirements: [
      "Bachelor's degree in Civil Engineering",
      "7+ years of experience",
      "Professional engineering license",
      "Experience with large-scale infrastructure projects",
      "Strong leadership skills"
    ],
    responsibilities: [
      "Lead project design and execution",
      "Manage engineering team",
      "Ensure quality and safety compliance",
      "Client relationship management",
      "Budget and timeline oversight"
    ]
  },
  {
    id: "2",
    title: "Logistics Coordinator",
    slug: "logistics-coordinator",
    department: "Operations",
    location: "Kolwezi, DRC",
    employment_type: "Full-time",
    experience_level: "Mid",
    description: "Join our logistics team to coordinate transportation and supply chain operations for our mining and construction clients.",
    requirements: [
      "Bachelor's degree in Logistics or related field",
      "3+ years of experience",
      "Knowledge of regional transportation networks",
      "Strong organizational skills",
      "Proficiency in logistics software"
    ],
    responsibilities: [
      "Coordinate daily logistics operations",
      "Manage fleet scheduling",
      "Optimize supply chain efficiency",
      "Maintain vendor relationships",
      "Ensure timely deliveries"
    ]
  },
  {
    id: "3",
    title: "Heavy Equipment Operator",
    slug: "heavy-equipment-operator",
    department: "Operations",
    location: "Kolwezi, DRC",
    employment_type: "Full-time",
    experience_level: "Mid",
    description: "Operate various heavy equipment for construction and mining support operations.",
    requirements: [
      "Valid heavy equipment operator certification",
      "3+ years of experience",
      "Safety training certifications",
      "Ability to work in challenging environments",
      "Basic mechanical knowledge"
    ],
    responsibilities: [
      "Operate excavators, loaders, and trucks",
      "Perform daily equipment inspections",
      "Follow safety protocols",
      "Report maintenance needs",
      "Support project completion"
    ]
  }
]

// Temporary function that returns static data instead of querying database
async function getJobs() {
  // Temporary fix: return static data instead of querying database
  // const jobs = await query<Job>("SELECT * FROM job_postings WHERE is_active = TRUE ORDER BY created_at DESC")
  // return jobs
  return staticJobs
}

export default async function CareersPage() {
  const jobs = await getJobs()

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Careers</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Join Our <span className="text-primary">Growing Team</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Be part of a dynamic team driving industrial development in the Democratic Republic of Congo. We're always
              looking for talented individuals to join us.
            </p>
          </ScrollAnimation>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Work With Us?</h2>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <ScrollAnimation key={benefit.title} delay={index * 100}>
                <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
      
      {/* Job Openings */}
      <JobsList jobs={jobs} />
      
      {/* Application Form */}
      <ApplicationForm jobs={jobs} />
      
      <Footer />
    </main>
  )
}