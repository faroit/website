import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const students = [
  ["Laura Ibáñez Martínez", "Master Student, Co-Supervision", '"MIDI-AudioLDM: MIDI-Conditional Text-to-Audio Synthesis Using ControlNet on AudioLDM"', "Summer 2023", "https://lauraibnz.github.io/", "https://lauraibnz.github.io/docs/TFM.pdf"],
  ["Johannes Imort", "Master student, RWTH Aachen (Germany)", 'Internship: "Sound Activity Detection"', "Winter 2022", "https://twitter.com/joimort", null],
  ["Jinsung Kim", "Master student, Korea University", 'Internship: "Unsupervised Music Separation"', "Winter 2022/2023", "https://onedas.github.io/", null],
  ["Michael Tänzer", "PhD student, Fraunhofer IDMT (Germany)", "Internship on audio tagging", "Summer 2021", null, null],
  ["Lucas Mathieu", "Master student, AgroParistech (France)", 'Master thesis: "Listening to the Wild"', "03/2020", "https://synergy.st-andrews.ac.uk/cbd/person/lm354/", null],
  ["Clara Jacintho & Delton Vaz", "Bachelor Thesis, PolyTech Montpellier (France)", '"Machine Learning for Audio on the Web"', "12/2019", "https://www.linkedin.com/in/clarajacintho/", null],
  ["Wolfgang Mack", "Master Thesis, FAU Erlangen-Nürnberg (Germany)", '"Investigations on Speaker Separation using Embeddings obtained by Deep Learning"', "05/2017", "https://www.audiolabs-erlangen.de/fau/assistant/mack", null],
  ["Erik Johnson", "DAAD Research internship, Carleton University (Canada)", '"Open-Source Implementation of Multichannel BSSEval in Python"', "03/2014", "https://ca.linkedin.com/in/ecmjohnson", "https://github.com/craffel/mir_eval/pull/199"],
  ["Nils Werner", "Master Thesis, FAU Erlangen-Nürnberg (Germany)", '"Parameter Estimation for Time-Varying Harmonic Audio Signals"', "02/2014", "https://nils-werner.github.io/", null],
] as const

const talks = [
  [
    "2026",
    '"AI Is Not Only Text and Images: A Case Study in Audio-AI" — Artificial Intelligence Meetup Frankfurt, Frankfurt (Germany)',
    "https://www.meetup.com/artificial-intelligence-meetup-frankfurt/events/312256334/",
  ],
  ["2026", "Invited industry talk, Music Information Retrieval (MIR) program, Master-2, Telecom-ParisTech, Paris (France)", null],
  ["2025", "Invited research talk and Q&A, Kyoto University, Kyoto (Japan)", "http://sap.ist.i.kyoto-u.ac.jp/members/yoshii/"],
  ["2023", '"Music Source Separation: Is it solved yet?", ParisTech, Paris (France)', "https://faroit.com/slides-paristech23"],
  ["2020", '"Current Trends in Audio Source Separation" — AES Symposium', "https://sigsep.github.io/AES2020_CurrentTrendsInSourceSeparation.pdf"],
  ["2019", '"Deep learning for music unmixing" — "Deep learning: From theory to applications"', "https://www.lebesgue.fr/video/2879"],
  ["2019", '"Deep learning for music separation" — Tutorial at EUSIPCO 2019', "https://sigsep.github.io/tutorials/"],
  ["2018", '"Music Separation with DNNs: Making It Work" — Tutorial at ISMIR 2018', "https://sigsep.github.io/tutorials/"],
] as const

export default function Service() {
  return (
    <section id="service" className="scroll-mt-20">
      <h2 className="font-heading text-3xl sm:text-4xl mb-6 inline-block bg-main text-main-foreground border-2 border-border rounded-base px-3 py-1 shadow-shadow">
        Scientific Service
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Editing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>Journals:</strong> Topic Editor for ML-Audio,{" "}
              <a className="underline underline-offset-4" href="https://joss.theoj.org/papers/edited_by/@faroit">
                Journal of Open Source Software
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Reviewing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Journals:</strong>{" "}
              <a className="underline underline-offset-4" href="https://joss.theoj.org/papers/reviewed_by/@faroit">
                Journal of Open Source Software
              </a>
              ,{" "}
              <a className="underline underline-offset-4" href="https://www.eurasip.org/">
                EURASIP
              </a>
            </p>
            <p>
              <strong>Conferences:</strong>{" "}
              <a className="underline underline-offset-4" href="https://www.ismir.net">
                ISMIR
              </a>
              ,{" "}
              <a className="underline underline-offset-4" href="https://eusipco2020.org/">
                EUSIPCO
              </a>
              ,{" "}
              <a className="underline underline-offset-4" href="https://www.dafx.de/">
                DAFx
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="font-heading text-4xl sm:text-5xl mt-10 mb-4">Student supervision</h3>
      <ul className="space-y-3">
        {students.map(([name, role, topic, when, link, doc]) => (
          <li
            key={String(name)}
            className="border-2 border-border rounded-base p-3 bg-secondary-background"
          >
            <div className="flex flex-wrap items-baseline gap-x-2">
              {link ? (
                <a className="font-heading underline underline-offset-4" href={link} target="_blank" rel="noreferrer">
                  {name}
                </a>
              ) : (
                <span className="font-heading">{name}</span>
              )}
              <span className="text-xs opacity-70">· {role}</span>
              <span className="ml-auto text-xs font-heading bg-main text-main-foreground border-2 border-border rounded-base px-2 py-0.5">
                {when}
              </span>
            </div>
            <p className="text-sm mt-1">
              {topic}
              {doc && (
                <>
                  {" "}
                  <a className="underline underline-offset-4" href={doc} target="_blank" rel="noreferrer">
                    [link]
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="font-heading text-4xl sm:text-5xl mt-10 mb-4">Teaching · Talks</h3>
      <ul className="space-y-3">
        {talks.map(([year, title, link], i) => (
          <li
            key={i}
            className="border-2 border-border rounded-base p-3 bg-secondary-background flex flex-wrap items-baseline gap-x-3"
          >
            <span className="inline-block bg-main text-main-foreground border-2 border-border rounded-base px-2 py-0.5 text-xs font-heading">
              {year}
            </span>
            <span className="text-sm">
              {title}
              {link && (
                <>
                  {" "}
                  <a className="underline underline-offset-4" href={link} target="_blank" rel="noreferrer">
                    [link]
                  </a>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="font-heading text-4xl sm:text-5xl mt-10 mb-4">Other resources</h3>
      <ul className="list-disc pl-5 text-sm space-y-1">
        <li>
          <a className="underline underline-offset-4" href="https://sigsep.github.io">
            sigsep.io
          </a>{" "}
          — open resources for music separation
        </li>
        <li>
          <a className="underline underline-offset-4" href="https://github.com/faroit/awesome-python-scientific-audio">
            awesome-scientific-python-audio
          </a>{" "}
          — curated list of Python packages for scientific research in audio
        </li>
      </ul>
    </section>
  )
}
