import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Music Processing",
    accent: "#00FA9A",
    body: (
      <>
        Background in digital signal processing (DSP) and a wide range of audio
        and related tasks, including speech and audio processing, music
        analysis and music information retrieval.
      </>
    ),
  },
  {
    title: "Audio-AI",
    accent: "#00BFFF",
    body: (
      <>
        Profound understanding of deep audio-ML — specifically{" "}
        <a
          className="underline underline-offset-4"
          href="https://github.com/faroit/CountNet"
        >
          source count estimation
        </a>{" "}
        and{" "}
        <a
          className="underline underline-offset-4"
          href="https://sigsep.github.io"
        >
          audio source separation
        </a>
        . Leading the research team at{" "}
        <a
          className="underline underline-offset-4"
          href="https://audioshake.ai"
        >
          Audioshake.ai
        </a>{" "}
        that built the best-performing music separation and lyric
        transcription models.
      </>
    ),
  },
  {
    title: "Eco-ML",
    accent: "#FF00FF",
    body: (
      <>
        Involved in{" "}
        <a className="underline underline-offset-4" href="https://plantnet.org">
          Pl@ntNet
        </a>{" "}
        as part of the{" "}
        <a
          className="underline underline-offset-4"
          href="https://www.cos4cloud-eosc.eu"
        >
          Cos4Cloud
        </a>{" "}
        citizen science project. Worked on ML for ecoacoustics, analyzing
        sounds of zebras using{" "}
        <a className="underline underline-offset-4" href="https://audiolog.fr">
          mobile audio loggers
        </a>
        .
      </>
    ),
  },
]

export default function Features() {
  return (
    <section className="border-b-2 border-border bg-secondary-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <Card key={f.title} className="bg-background">
            <CardHeader>
              <div
                className="w-10 h-10 rounded-base border-2 border-border"
                style={{ background: f.accent }}
                aria-hidden
              />
              <CardTitle className="text-2xl mt-3">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{f.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
