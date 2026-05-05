import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button variant="neutral" size="sm" asChild>
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    </Button>
  )
}

export default function Datasets() {
  return (
    <section id="datasets" className="scroll-mt-20">
      <h2 className="font-heading text-3xl sm:text-4xl mb-6 inline-block bg-main text-main-foreground border-2 border-border rounded-base px-3 py-1 shadow-shadow">
        Datasets
      </h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <img src="/sigsep.png" alt="" className="w-8 h-8 object-contain" />
              <CardTitle className="text-2xl">MUSDB18</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <em>musdb18</em> is a dataset of 150 full-length music tracks
              (~10h duration) of different genres along with their isolated
              drums, bass, vocals, and other stems. It is currently the largest
              publicly available dataset used for music separation, serving as a
              benchmark for music separation tasks.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://sigsep.github.io/datasets/musdb.html">Website</LinkButton>
              <LinkButton href="https://paperswithcode.com/dataset/musdb18">Papers with Code</LinkButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">LibriCount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              A simulated cocktail-party environment of [0..10] speakers, mixed
              at 0 dB SNR from random utterances of different speakers from the
              LibriSpeech CleanTest dataset. All recordings are 5s in duration,
              16-bit, 16kHz, mono — accompanied by per-recording JSON
              annotations.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://denumerate.app">Listening Experiment</LinkButton>
              <LinkButton href="https://zenodo.org/record/1216072">Download</LinkButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Muserc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <div className="aspect-video w-full border-2 border-border rounded-base overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube-nocookie.com/embed/yOKvqz2jZgM"
                title="Muserc"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p>
              A dataset of musical instruments built around a violin cello —
              with sensor recordings capturing the finger position on the
              fingerboard (converted to instantaneous frequency estimates),
              high-speed video data (2000 fps) capturing string excitations, all
              sample-synchronized.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://www.audiolabs-erlangen.com/resources/muserc">Website</LinkButton>
              <LinkButton href="https://zenodo.org/record/1560651">Download</LinkButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
