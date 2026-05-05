export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-secondary-background mt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm">
        <p>© Fabian-Robert Stöter</p>
        <a
          className="underline underline-offset-4 hover:bg-main hover:text-main-foreground border-2 border-transparent hover:border-border rounded-base px-2 py-1"
          href="https://github.com/faroit/website"
        >
          Code for this website →
        </a>
      </div>
    </footer>
  )
}
