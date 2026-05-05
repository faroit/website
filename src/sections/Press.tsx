const items = [
  {
    date: "02/2023",
    title: '"l\'intelligence artificielle et du droit d\'auteur"',
    outlet: "Radio-Canada (French)",
    href: "https://ici.radio-canada.ca/ohdio/premiere/emissions/jusquau-bout/episodes/683554/rattrapage-du-vendredi-27-janvier-2023",
  },
  {
    date: "12/2022",
    title: '"Jahresrückblick und Vorausschau: KI Musik und Metaverse"',
    outlet: "Deutschlandfunk Kultur (German)",
    href: "https://www.deutschlandfunkkultur.de/jahresrueckblick-und-vorausschau-ki-musik-und-metaverse-dlf-kultur-e70bf447-100.html",
  },
  {
    date: "02/2022",
    title: '"L\'intelligence artificielle au profit des stems musicaux"',
    outlet: "Radio-Canada (French)",
    href: "https://ici.radio-canada.ca/ohdio/premiere/emissions/jusquau-bout/episodes/605268/rattrapage-du-vendredi-11-fevrier-2022/1",
  },
  {
    date: "12/2021",
    title: '"Recycling von Songs: Wie KI neue Musik generiert"',
    outlet: "Deutschlandfunk Kultur (German)",
    href: "https://www.deutschlandfunkkultur.de/recycling-von-songs-wie-ki-neue-musik-generiert-dlf-kultur-90e01124-100.html",
  },
]

export default function Press() {
  return (
    <section>
      <h3 className="font-heading text-4xl sm:text-5xl mb-4">Press / Media interviews</h3>
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.href}
            className="border-2 border-border rounded-base p-3 bg-secondary-background flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span className="inline-block bg-main text-main-foreground border-2 border-border rounded-base px-2 py-0.5 text-xs font-heading">
              {it.date}
            </span>
            <a
              href={it.href}
              className="underline underline-offset-4 font-base"
              target="_blank"
              rel="noreferrer"
            >
              {it.title}
            </a>
            <span className="text-sm opacity-80">— {it.outlet}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
