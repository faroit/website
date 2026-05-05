import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const ZOTERO_USER = "6408178"
const API_BASE = `https://api.zotero.org/users/${ZOTERO_USER}/publications/items`

type Author = { given?: string; family?: string }
type CSL = {
  title?: string
  author?: Author[]
  "container-title"?: string
  URL?: string
  DOI?: string
  issued?: { "date-parts"?: number[][] }
}
type ZoteroItem = {
  key: string
  csljson: CSL
  data: { date?: string; extra?: string; itemType?: string }
}

function parseExtra(extra?: string): Record<string, string> {
  const fields: Record<string, string> = {}
  if (!extra) return fields
  extra.replace(/^([A-Za-z \-]+)(:\s*.+)/gm, (_m, field: string, value: string) => {
    fields[field.toLowerCase().replace(/ /g, "-")] = value.slice(2).trim()
    return ""
  })
  return fields
}

function exportbib(key: string, format: "bibtex" | "csljson") {
  return `${API_BASE}/${key}?format=${format}`
}

function PubItem({ item }: { item: ZoteroItem }) {
  const csl = item.csljson
  const extra = parseExtra(item.data.extra)
  const authors = csl.author ?? []
  const venue = csl["container-title"]
  const date = item.data.date ?? csl.issued?.["date-parts"]?.[0]?.[0] ?? ""

  return (
    <article className="border-2 border-border rounded-base p-4 bg-secondary-background shadow-shadow">
      <h4 className="font-serif font-normal text-xl leading-snug">{csl.title}</h4>
      <p className="text-sm mt-1 opacity-90">
        {authors
          .map((a) => `${a.given ?? ""} ${a.family ?? ""}`.trim())
          .join(", ")}
      </p>
      {(venue || date) && (
        <p className="text-sm italic mt-1">
          {venue}
          {venue && date ? ", " : ""}
          {date}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {extra.pdf && (
          <Button variant="neutral" size="sm" asChild>
            <a href={extra.pdf} target="_blank" rel="noreferrer">
              PDF
            </a>
          </Button>
        )}
        {csl.URL && (
          <Button variant="neutral" size="sm" asChild>
            <a href={csl.URL} target="_blank" rel="noreferrer">
              Website
            </a>
          </Button>
        )}
        {extra.github && (
          <Button variant="neutral" size="sm" asChild>
            <a href={extra.github} target="_blank" rel="noreferrer">
              Code
            </a>
          </Button>
        )}
        {csl.DOI && (
          <Button variant="neutral" size="sm" asChild>
            <a
              href={`https://dx.doi.org/${csl.DOI}`}
              target="_blank"
              rel="noreferrer"
            >
              DOI
            </a>
          </Button>
        )}
        <Button variant="neutral" size="sm" asChild>
          <a href={exportbib(item.key, "bibtex")} target="_blank" rel="noreferrer">
            BibTeX
          </a>
        </Button>
        <Button variant="neutral" size="sm" asChild>
          <a href={exportbib(item.key, "csljson")} target="_blank" rel="noreferrer">
            JSON
          </a>
        </Button>
      </div>
    </article>
  )
}

function PubList({ filter, label }: { filter: string; label: string }) {
  const [items, setItems] = useState<ZoteroItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = `${API_BASE}?format=json&include=data,csljson&sort=date&limit=100&itemType=${filter}`
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Zotero API ${r.status}`)
        return (await r.json()) as ZoteroItem[]
      })
      .then(setItems)
      .catch((e) => setError(String(e)))
  }, [filter])

  if (error) {
    return (
      <p className="text-sm text-foreground/70">
        Could not load {label.toLowerCase()}: {error}
      </p>
    )
  }
  if (!items) {
    return (
      <ul className="space-y-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="border-2 border-border rounded-base p-4 bg-secondary-background animate-pulse h-24"
          />
        ))}
      </ul>
    )
  }
  if (items.length === 0) {
    return <p className="text-sm">No {label.toLowerCase()} listed.</p>
  }
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.key}>
          <PubItem item={it} />
        </li>
      ))}
    </ul>
  )
}

export default function Publications() {
  return (
    <section id="publications" className="scroll-mt-20">
      <h2 className="font-heading text-3xl sm:text-4xl mb-6 inline-block bg-main text-main-foreground border-2 border-border rounded-base px-3 py-1 shadow-shadow">
        Publications
      </h2>
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="neutral" size="sm" asChild>
          <a
            href="https://scholar.google.com/citations?user=7HsSdqwAAAAJ&hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Google Scholar
          </a>
        </Button>
        <Button variant="neutral" size="sm" asChild>
          <a href="https://www.zotero.org/faroit" target="_blank" rel="noreferrer">
            Zotero
          </a>
        </Button>
      </div>

      <h3 className="font-heading text-4xl sm:text-5xl mb-3">Peer-reviewed journals</h3>
      <PubList filter="journalArticle" label="Journal articles" />

      <h3 className="font-heading text-4xl sm:text-5xl mt-10 mb-3">
        Peer-reviewed conferences
      </h3>
      <PubList filter="conferencePaper" label="Conference papers" />
    </section>
  )
}
