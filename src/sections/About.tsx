export default function About() {
  return (
    <section id="about" className="scroll-mt-20">
      <h2 className="font-heading text-3xl sm:text-4xl mb-6 inline-block bg-main text-main-foreground border-2 border-border rounded-base px-3 py-1 shadow-shadow">
        About Me
      </h2>
      <div className="prose max-w-none">
        <p className="text-base leading-relaxed">
          Since 2021, I&apos;m head of research at{" "}
          <a className="underline underline-offset-4" href="https://www.audioshake.ai">audioshake.ai</a>{" "}
          working on music-ML research. Before, I was a postdoctoral researcher
          at the{" "}
          <a className="underline underline-offset-4" href="http://www-sop.inria.fr/teams/zenith/pmwiki/pmwiki.php/Main/HomePage">
            Inria and University of Montpellier
          </a>
          , France. I did my Ph.D (Dr.-Ing.) at the{" "}
          <a className="underline underline-offset-4" href="https://www.audiolabs-erlangen.de/">
            International Audio Laboratories Erlangen
          </a>{" "}
          (a joint institution of{" "}
          <a className="underline underline-offset-4" href="https://www.iis.fraunhofer.de">Fraunhofer IIS</a>{" "}
          and{" "}
          <a className="underline underline-offset-4" href="https://fau.de">FAU Erlangen-Nürnberg</a>) supervised by{" "}
          <a className="underline underline-offset-4" href="https://www.audiolabs-erlangen.de/fau/professor/edler">
            Bernd Edler
          </a>
          . My dissertation,{" "}
          <strong>
            «Separation and Count Estimation for Audio Sources Overlapping in
            Time and Frequency»
          </strong>
          , can be viewed{" "}
          <a className="underline underline-offset-4" href="https://opus4.kobv.de/opus4-fau/frontdoor/index/index/docId/13114">
            here
          </a>
          . I graduated in electrical engineering / communication engineering
          from the{" "}
          <a className="underline underline-offset-4" href="https://www.uni-hannover.de">
            University of Hannover, Germany
          </a>
          . An extended CV is available{" "}
          <a className="underline underline-offset-4" href="https://github.com/faroit/resume/releases/download/v1.0.2/stoeter_resume.pdf">
            here
          </a>
          .
        </p>
      </div>

      <h3 className="font-heading text-4xl sm:text-5xl mt-10 mb-4">Current research interests</h3>
      <ul className="space-y-4 list-none">
        {[
          {
            t: "Deep learning on data hubs",
            d: "Multi-modal foundation models that learn the relations between modalities to reconstruct or enhance missing or degraded data.",
          },
          {
            t: "User-centered AI for audio data",
            d: "New methods and tools for users with domain knowledge to deliver interpretable audio models. Evaluation of audio processing tasks is often computational, due to lack of expertise from signal-processing researchers in organizing perceptual evaluation campaigns.",
          },
          {
            t: "Ecological machine-learning",
            d: "Reducing the carbon footprint of my work — smaller datasets to speed up training, lower computational complexity (quantization, pruning, compression), and conversion of deep models for deployment on edge devices.",
          },
        ].map((it) => (
          <li
            key={it.t}
            className="border-2 border-border bg-secondary-background rounded-base p-4 shadow-shadow"
          >
            <strong className="font-serif font-normal">{it.t}</strong>
            <p className="mt-1 text-sm leading-relaxed">{it.d}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
