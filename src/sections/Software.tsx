import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

export default function Software() {
  return (
    <section id="software" className="scroll-mt-20">
      <h2 className="font-heading text-3xl sm:text-4xl mb-6 inline-block bg-main text-main-foreground border-2 border-border rounded-base px-3 py-1 shadow-shadow">
        Software
      </h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <img src="/pytorchlogo.svg" alt="" className="w-6 h-6" />
              <CardTitle className="text-2xl">open-unmix</CardTitle>
              <Badge>Winner: PyTorch Global Hackathon 2019</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video w-full border-2 border-border rounded-base overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube-nocookie.com/embed/IxLnoy-GzqI"
                title="open-unmix"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-sm leading-relaxed">
              Open-Unmix, a deep neural network reference implementation
              (PyTorch and NNabla) for music source separation, applicable for
              researchers, audio engineers and artists. Open-Unmix provides
              ready-to-use models that separate pop music into four stems:
              vocals, drums, bass and other.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://sigsep.github.io/open-unmix/">Website / Demo</LinkButton>
              <LinkButton href="https://github.com/sigsep/open-unmix-pytorch">Code</LinkButton>
              <LinkButton href="https://joss.theoj.org/papers/10.21105/joss.01667">Paper</LinkButton>
              <LinkButton href="https://devpost.com/software/open-unmix">PyTorch Hackathon</LinkButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">CountNet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <video controls className="w-full border-2 border-border rounded-base bg-black">
              <source src="https://www.audiolabs-erlangen.de/content/resources/00-2017-CountNet/rnn_demo.mp4" type="video/mp4" />
            </video>
            <p className="text-sm leading-relaxed">
              CountNet is a deep learning model that estimates the number of
              concurrent speakers from single-channel speech mixtures. A
              mandatory first step for any realistic &ldquo;cocktail-party&rdquo;
              scenario, with applications in blind source separation, speaker
              diarisation, and audio surveillance.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://github.com/faroit/countnet">Code</LinkButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">musdb + museval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              Python packages to parse and process the MUSDB18 dataset, the
              largest open-access dataset for music source separation. Originally
              developed for the SISEC Music Separation task.
            </p>
            <pre className="bg-foreground text-background border-2 border-border rounded-base p-4 text-xs overflow-x-auto"><code>{`import musdb
mus = musdb.DB(download=True)
for track in mus:
    train(track.audio, track.targets['vocals'].audio)`}</code></pre>
            <pre className="bg-foreground text-background border-2 border-border rounded-base p-4 text-xs overflow-x-auto"><code>{`import museval
for track in mus:
    estimates = predict(track)
    scores = museval.eval_mus_track(track, estimates)
    print(scores)`}</code></pre>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://github.com/sigsep/sigsep-mus-db">musdb</LinkButton>
              <LinkButton href="https://github.com/sigsep/sigsep-mus-eval">museval</LinkButton>
            </div>
          </CardContent>
        </Card>

        <h3 className="font-heading text-4xl sm:text-5xl pt-4">Hackathon projects</h3>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl">DeMask</CardTitle>
              <Badge>1st Place — 2020 PyTorch Summer Hackathon</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Collaborators:</strong> Manuel Pariente, Samuele Cornell,
              Michel Olvera, Jonas Haag
            </p>
            <p>
              End-to-end model for enhancing speech while wearing face masks.
              Built with Asteroid, a PyTorch-based audio source separation
              toolkit.
            </p>
            <LinkButton href="https://devpost.com/software/asteroid-the-pytorch-based-source-separation-toolkit">
              DevPost
            </LinkButton>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl">git wig</CardTitle>
              <Badge>Winner — 2015 Midi-Hackday Berlin</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Collaborators:</strong> Nils Werner, Patricio Lopez-Serrano
            </p>
            <p>
              Why can&apos;t we have version control for making music? We merged
              git with a terminal-based music sequencer, calling it{" "}
              <code className="px-1 bg-secondary-background border border-border rounded-sm">
                git wig
              </code>
              . Realized git push by bringing the feature into a hardware
              controller.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="https://github.com/RocketScienceAbteilung/git-grid">git grid</LinkButton>
              <LinkButton href="https://github.com/RocketScienceAbteilung/git-wig">git wig</LinkButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl">DeepFandom</CardTitle>
              <Badge>1st Place — 2016 Music Hackday Berlin</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Collaborators:</strong> Patricio Lopez-Serrano
            </p>
            <p>
              DeepFandom is a deep learning model that learns SoundCloud
              comments and predicts what your track could get as comments and
              where they&apos;d sit on the waveform.
            </p>
            <LinkButton href="https://devpost.com/software/deep-fandom">DevPost</LinkButton>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Magiclock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              macOS application that uses haptic feedback (Taptic Engine™) to
              let you <em>feel</em> the MIDI clock beat through your Magic
              Trackpad.
            </p>
            <LinkButton href="https://github.com/faroit/magiclock">Code</LinkButton>
          </CardContent>
        </Card>

        <h3 className="font-heading text-4xl sm:text-5xl pt-4">Other software contributions</h3>
        <ul className="space-y-2 text-sm">
          {[
            ["stempeg", "https://github.com/faroit/stempeg", "read/write of STEMS multistream audio"],
            ["trackswitch.js", "https://github.com/audiolabs/trackswitch.js/", "a versatile web-based audio player for presenting scientific results"],
            ["webMUSHRA", "https://github.com/audiolabs/webMUSHRA", "MUSHRA-compliant Web Audio API experiment software"],
            ["norbert", "https://github.com/sigsep/norbert", "painless Wiener filters for audio separation"],
          ].map(([name, href, desc]) => (
            <li key={href} className="border-2 border-border rounded-base p-3 bg-secondary-background">
              <a className="font-heading underline underline-offset-4" href={href} target="_blank" rel="noreferrer">
                {name}
              </a>
              <span className="opacity-80"> — {desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
