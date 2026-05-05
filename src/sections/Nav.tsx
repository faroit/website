import { useEffect, useRef, useState } from "react"
import WaveformBackground from "@/components/WaveformBackground"

const items = [
  { text: "About", href: "#about" },
  { text: "Service", href: "#service" },
  { text: "Software", href: "#software" },
  { text: "Datasets", href: "#datasets" },
  { text: "Publications", href: "#publications" },
]

export default function Nav() {
  const [zoomProgress, setZoomProgress] = useState(0)
  const [activeHref, setActiveHref] = useState("#about")
  const [topRubberband, setTopRubberband] = useState(0)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    let raf = 0
    const clamp01 = (value: number) => {
      if (!Number.isFinite(value)) return 0
      return Math.max(0, Math.min(1, value))
    }
    const update = () => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const scrollY = Math.max(0, Math.min(maxScroll, window.scrollY))
      const scrollable = Math.max(
        1,
        maxScroll,
      )
      const raw = clamp01(scrollY / scrollable)
      const accelerated = Math.pow(raw, 0.7)
      const eased = accelerated * accelerated * (3 - 2 * accelerated)
      setZoomProgress(eased)
      if (scrollY > 0 || window.scrollY >= 0) setTopRubberband(0)

      const activationY = 140
      let nextActive = items[0].href
      for (const item of items) {
        const el = document.querySelector(item.href) as HTMLElement | null
        if (!el) continue
        const { top } = el.getBoundingClientRect()
        if (top <= activationY) nextActive = item.href
      }
      setActiveHref(nextActive)
      raf = 0
    }
    const scheduleUpdate = () => {
      if (raf !== 0) return
      raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current =
        window.scrollY <= 0 ? event.touches[0]?.clientY ?? null : null
    }
    const onTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current
      const currentY = event.touches[0]?.clientY
      if (startY === null || currentY === undefined || window.scrollY > 0) {
        setTopRubberband(0)
        return
      }
      const pull = currentY - startY
      setTopRubberband(pull > 0 ? Math.min(72, Math.sqrt(pull) * 7) : 0)
    }
    const onTouchEnd = () => {
      touchStartYRef.current = null
      setTopRubberband(0)
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("touchcancel", onTouchEnd, { passive: true })
    return () => {
      if (raf !== 0) window.cancelAnimationFrame(raf)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [])

  return (
    <>
      <nav
        className="ios-waveform-nav sticky top-0 z-50 border-b-2 border-border text-foreground overflow-hidden"
        style={{ background: "var(--chrome)" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-full origin-top opacity-90 transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(0, ${topRubberband * -0.15}px, 0) scaleY(${
              1 + topRubberband / 180
            })`,
            transitionDuration: topRubberband > 0 ? "0ms" : "300ms",
          }}
        >
          <WaveformBackground
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/808patterns_01.ogg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
            waveColor="#FFFFF0"
            bgColor="#00BFFF"
            zoomProgress={zoomProgress}
            interactive={false}
            showControls={false}
            showHint={false}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 h-18" />
      </nav>

      <aside className="fixed right-4 top-24 z-40 hidden lg:block">
        <ul className="flex flex-col items-stretch gap-2">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`sidebar-link block rounded-base border-2 border-border bg-secondary-background/95 px-3 py-2 text-sm font-base shadow-shadow transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out ${
                  activeHref === item.href
                    ? "is-active bg-main text-main-foreground translate-x-reverseBoxShadowX translate-y-reverseBoxShadowY shadow-none"
                    : "text-foreground hover:bg-main hover:text-main-foreground hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                }`}
                aria-current={activeHref === item.href ? "page" : undefined}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
