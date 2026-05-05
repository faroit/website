import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"

const socials = [
  { href: "https://sigmoid.social/@faro", label: "Mastodon", rel: "me" },
  { href: "https://github.com/faroit", label: "GitHub" },
  {
    href: "https://scholar.google.com/citations?user=7HsSdqwAAAAJ&hl=en",
    label: "Scholar",
  },
  { href: "mailto:fabian-robert.stoter@inria.fr", label: "Email" },
  { href: "https://orcid.org/0000-0002-2534-1165", label: "ORCID" },
]

const memphisShapes = [
  { type: "bar", color: "teal", style: { left: "6%", top: "14%", "--shape-rotate": "-42deg" } },
  { type: "dot", color: "yellow", style: { left: "3%", top: "29%" } },
  { type: "triangle", color: "blue", style: { left: "11%", top: "62%", "--shape-rotate": "38deg" } },
  { type: "squiggle", color: "ink", style: { left: "16%", top: "16%", "--shape-rotate": "8deg" } },
  { type: "triangle", color: "teal", style: { left: "23%", top: "33%", "--shape-rotate": "-24deg" } },
  { type: "diamond", color: "purple", style: { left: "30%", top: "18%", "--shape-rotate": "22deg" } },
  { type: "squiggle", color: "ink", style: { left: "29%", top: "58%", "--shape-rotate": "-9deg" } },
  { type: "bar", color: "pink", style: { left: "39%", top: "28%", "--shape-rotate": "-33deg" } },
  { type: "dot", color: "teal", style: { left: "46%", top: "23%" } },
  { type: "triangle", color: "yellow", style: { left: "44%", top: "68%", "--shape-rotate": "18deg" } },
  { type: "dot", color: "pink", style: { left: "57%", top: "50%" } },
  { type: "squiggle", color: "ink", style: { left: "58%", top: "25%", "--shape-rotate": "-14deg" } },
  { type: "bar", color: "blue", style: { left: "69%", top: "14%", "--shape-rotate": "84deg" } },
  { type: "triangle", color: "teal", style: { left: "73%", top: "49%", "--shape-rotate": "58deg" } },
  { type: "dot", color: "pink-soft", style: { left: "85%", top: "34%" } },
  { type: "bar", color: "yellow", style: { left: "89%", top: "45%", "--shape-rotate": "-16deg" } },
  { type: "squiggle", color: "ink", style: { left: "82%", top: "65%", "--shape-rotate": "13deg" } },
]

export default function Hero() {
  return (
    <header
      id="top"
      className="relative border-b-2 border-border overflow-hidden"
    >
      <div className="memphis-field" aria-hidden>
        {memphisShapes.map((shape, index) => (
          <span
            key={`${shape.type}-${index}`}
            className={`memphis-shape memphis-${shape.type} memphis-${shape.color}`}
            style={{
              ...shape.style,
              animationDelay: `${index * -0.45}s`,
              animationDuration: `${7 + (index % 5)}s`,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-[auto_1fr] gap-10 items-center pointer-events-none">
        <div className="relative pointer-events-auto w-fit">
          <div className="retro-photo-cut absolute inset-0 translate-x-2 translate-y-2 bg-accent border-2 border-border rounded-base" />
          <div className="retro-photo relative w-44 h-44 sm:w-56 sm:h-56 border-2 border-border bg-secondary-background">
            <img
              src="/frs.png"
              alt="Fabian-Robert Stöter"
              className="relative w-full h-full object-cover rounded-base"
            />
          </div>
        </div>
        <div className="pointer-events-auto">
          <div className="relative inline-block bg-secondary-background border-2 border-border rounded-base shadow-shadow px-4 py-3">
            <h1 className="font-heading text-4xl sm:text-6xl leading-tight tracking-tight">
              Fabian-Robert Stöter
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-serif font-normal">
              Head of Research at{" "}
              <a
                href="https://audioshake.ai"
                className="underline decoration-2 underline-offset-4 decoration-accent hover:bg-main hover:text-main-foreground"
              >
                Audioshake.ai
              </a>{" "}
              · Frankfurt, Germany
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <Button key={s.href} variant="neutral" size="sm" asChild>
                <a
                  href={s.href}
                  rel={s.rel}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  {s.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
