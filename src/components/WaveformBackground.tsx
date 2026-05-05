import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Color = [number, number, number, number]

function parseColor(c: string): Color {
  if (c.startsWith("#")) {
    let h = c.slice(1)
    if (h.length === 3)
      h = h
        .split("")
        .map((ch) => ch + ch)
        .join("")
    const r = parseInt(h.slice(0, 2), 16) / 255
    const g = parseInt(h.slice(2, 4), 16) / 255
    const b = parseInt(h.slice(4, 6), 16) / 255
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
    return [r, g, b, a]
  }
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s))
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255, parts[3] ?? 1]
  }
  return [1, 1, 1, 1]
}

const VERT = `#version 300 es
in float a_sampleIdx;
in float a_value;
in vec3 a_color;
uniform float u_viewLeft;
uniform float u_spp;
uniform float u_canvasW;
uniform float u_yScale;
uniform float u_pointSize;
uniform bool u_useSampleIdx;
uniform bool u_useVertexColor;
uniform vec4 u_color;
out vec4 v_color;
void main() {
  float xpx = u_useSampleIdx ? (a_sampleIdx - u_viewLeft) / u_spp : a_sampleIdx;
  float clipX = (xpx / u_canvasW) * 2.0 - 1.0;
  float clipY = clamp(a_value, -1.0, 1.0) * u_yScale;
  gl_Position = vec4(clipX, clipY, 0.0, 1.0);
  gl_PointSize = u_pointSize;
  v_color = u_useVertexColor ? vec4(a_color, u_color.a) : u_color;
}
`

const FRAG = `#version 300 es
precision mediump float;
uniform bool u_isPoint;
in vec4 v_color;
out vec4 outColor;
void main() {
  if (u_isPoint) {
    vec2 d = gl_PointCoord - vec2(0.5);
    if (dot(d, d) > 0.25) discard;
  }
  outColor = v_color;
}
`

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function mixColor(a: Color, b: Color, t: number): Color {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
    lerp(a[3], b[3], t),
  ]
}

function amplitudeColor(a: number): Color {
  const amp = Math.max(0, Math.min(1, a))
  const white = parseColor("#FFFFF0")
  const c1 = mixColor(white, parseColor("#00BFFF"), 0.2)
  const c3 = mixColor(white, parseColor("#FFCF3A"), 0.22)
  const c4 = mixColor(white, parseColor("#FF00FF"), 0.26)
  if (amp < 0.33) return mixColor(white, c1, amp / 0.33)
  if (amp < 0.66) return mixColor(c1, c3, (amp - 0.33) / 0.33)
  return mixColor(c3, c4, (amp - 0.66) / 0.34)
}

function compileShader(g: WebGL2RenderingContext, type: number, src: string) {
  const sh = g.createShader(type)!
  g.shaderSource(sh, src)
  g.compileShader(sh)
  if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) {
    console.error(g.getShaderInfoLog(sh))
    throw new Error("shader compile failed")
  }
  return sh
}

function buildPyramid(samples: Float32Array): Float32Array[] {
  const pyramid: Float32Array[] = []
  pyramid[0] = samples
  let prev: Float32Array | null = null
  let level = 1
  while (true) {
    const binSize = 1 << level
    const numBins = Math.ceil(samples.length / binSize)
    if (numBins < 1) break
    const arr = new Float32Array(numBins * 2)
    if (level === 1) {
      for (let b = 0; b < numBins; b++) {
        const i0 = b * 2
        const i1 = Math.min(i0 + 2, samples.length)
        let mn = Infinity
        let mx = -Infinity
        for (let i = i0; i < i1; i++) {
          const v = samples[i]
          if (v < mn) mn = v
          if (v > mx) mx = v
        }
        arr[b * 2] = mn
        arr[b * 2 + 1] = mx
      }
    } else {
      const src = prev!
      const srcBins = src.length / 2
      for (let b = 0; b < numBins; b++) {
        const i0 = b * 2
        const i1 = Math.min(i0 + 2, srcBins)
        let mn = Infinity
        let mx = -Infinity
        for (let i = i0; i < i1; i++) {
          const a = src[i * 2]
          const c = src[i * 2 + 1]
          if (a < mn) mn = a
          if (c > mx) mx = c
        }
        arr[b * 2] = mn
        arr[b * 2 + 1] = mx
      }
    }
    pyramid[level] = arr
    prev = arr
    level++
    if (numBins <= 1 || level > 30) break
  }
  return pyramid
}

function dpr() {
  return Math.min(window.devicePixelRatio || 1, 2)
}

function fmtTime(t: number) {
  if (!isFinite(t)) t = 0
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const ms = Math.floor((t % 1) * 100)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(2, "0")}`
}

function colorToCss(c: Color) {
  return `rgb(${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(
    c[2] * 255,
  )} / ${c[3]})`
}

function fallbackWaveformDataUri(waveColor: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="180" viewBox="0 0 720 180"><path d="M0 90L8 88L16 92L24 78L32 106L40 56L48 128L56 66L64 116L72 82L80 94L88 52L96 136L104 44L112 144L120 72L128 108L136 84L144 96L152 68L160 118L168 36L176 150L184 62L192 124L200 86L208 94L216 74L224 112L232 58L240 130L248 46L256 144L264 68L272 118L280 82L288 98L296 64L304 126L312 54L320 134L328 76L336 106L344 86L352 94L360 58L368 132L376 42L384 146L392 72L400 112L408 84L416 96L424 70L432 120L440 52L448 136L456 64L464 126L472 80L480 100L488 56L496 130L504 48L512 142L520 66L528 120L536 84L544 96L552 74L560 112L568 60L576 128L584 50L592 138L600 70L608 116L616 82L624 98L632 62L640 124L648 54L656 134L664 76L672 106L680 86L688 94L696 80L704 102L712 88L720 90" fill="none" stroke="${waveColor}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

interface Props {
  src: string
  height?: number
  waveColor?: string
  bgColor?: string
  className?: string
  stopAutoZoom?: boolean
  zoomProgress?: number | null
  interactive?: boolean
  showControls?: boolean
  showHint?: boolean
}

export default function WaveformBackground({
  src,
  waveColor = "#00FA9A",
  bgColor = "#FFFFF0",
  className,
  stopAutoZoom = false,
  zoomProgress = null,
  interactive = true,
  showControls = true,
  showHint = true,
}: Props) {
  const fallbackBg = colorToCss(parseColor(bgColor))
  const fallbackWave = colorToCss(parseColor(waveColor))
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const zoomProgressRef = useRef<number | null>(zoomProgress)

  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Mutable view + GL state lives in refs to avoid re-renders per frame.
  const stateRef = useRef({
    viewLeft: 0,
    samplesPerPixel: 1,
    totalSamples: 0,
    sampleRate: 44100,
    durationSec: 0,
    autoZoomEnabled: true,
    autoZoomStartedAtMs: 0,
    pyramid: [] as Float32Array[],
    rawSamples: null as Float32Array | null,
    audioCtx: null as AudioContext | null,
    audioBuffer: null as AudioBuffer | null,
    sourceNode: null as AudioBufferSourceNode | null,
    startCtxTime: 0,
    startOffset: 0,
    playing: false,
    currentTimeSec: 0,
    rafHandle: 0,
    gl: null as WebGL2RenderingContext | null,
    program: null as WebGLProgram | null,
    posVbo: null as WebGLBuffer | null,
    aSampleIdx: 0,
    aValue: 0,
    aColor: 0,
    uViewLeft: null as WebGLUniformLocation | null,
    uSpp: null as WebGLUniformLocation | null,
    uCanvasW: null as WebGLUniformLocation | null,
    uYScale: null as WebGLUniformLocation | null,
    uColor: null as WebGLUniformLocation | null,
    uPointSize: null as WebGLUniformLocation | null,
    uIsPoint: null as WebGLUniformLocation | null,
    uUseSampleIdx: null as WebGLUniformLocation | null,
    uUseVertexColor: null as WebGLUniformLocation | null,
    envBuf: new Float32Array(0),
    lineBuf: new Float32Array(0),
    stemBuf: new Float32Array(0),
    waveColor: parseColor(waveColor),
    bgColor: parseColor(bgColor),
  })

  // Update color refs if props change
  useEffect(() => {
    stateRef.current.waveColor = parseColor(waveColor)
    stateRef.current.bgColor = parseColor(bgColor)
  }, [waveColor, bgColor])

  useEffect(() => {
    if (stopAutoZoom) {
      stateRef.current.autoZoomEnabled = false
    }
  }, [stopAutoZoom])

  useEffect(() => {
    if (zoomProgress !== null) {
      stateRef.current.autoZoomEnabled = false
    }
  }, [zoomProgress])

  useEffect(() => {
    zoomProgressRef.current = zoomProgress
  }, [zoomProgress])

  // Init GL + load audio + raf loop
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const s = stateRef.current

    const g = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
    })
    if (!g) {
      console.error("WebGL2 not supported")
      return
    }
    s.gl = g

    const vs = compileShader(g, g.VERTEX_SHADER, VERT)
    const fs = compileShader(g, g.FRAGMENT_SHADER, FRAG)
    const p = g.createProgram()!
    g.attachShader(p, vs)
    g.attachShader(p, fs)
    g.linkProgram(p)
    if (!g.getProgramParameter(p, g.LINK_STATUS)) {
      console.error(g.getProgramInfoLog(p))
      return
    }
    s.program = p
    s.aSampleIdx = g.getAttribLocation(p, "a_sampleIdx")
    s.aValue = g.getAttribLocation(p, "a_value")
    s.aColor = g.getAttribLocation(p, "a_color")
    s.uViewLeft = g.getUniformLocation(p, "u_viewLeft")
    s.uSpp = g.getUniformLocation(p, "u_spp")
    s.uCanvasW = g.getUniformLocation(p, "u_canvasW")
    s.uYScale = g.getUniformLocation(p, "u_yScale")
    s.uColor = g.getUniformLocation(p, "u_color")
    s.uPointSize = g.getUniformLocation(p, "u_pointSize")
    s.uIsPoint = g.getUniformLocation(p, "u_isPoint")
    s.uUseSampleIdx = g.getUniformLocation(p, "u_useSampleIdx")
    s.uUseVertexColor = g.getUniformLocation(p, "u_useVertexColor")
    s.posVbo = g.createBuffer()
    g.enable(g.BLEND)
    g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA)

    const ensureBuf = (buf: Float32Array, n: number) => {
      if (buf.length >= n) return buf
      let cap = buf.length || 64
      while (cap < n) cap *= 2
      return new Float32Array(cap)
    }

    const resizeCanvas = () => {
      if (!canvas || !wrap || !s.gl) return
      const r = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.floor(r.width * dpr()))
      const h = Math.max(1, Math.floor(r.height * dpr()))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        s.gl.viewport(0, 0, w, h)
      }
    }

    const clampView = () => {
      if (!canvas || s.totalSamples <= 0) return
      const w = canvas.width
      const maxSpp = s.totalSamples / w
      const minSpp = 1 / 16
      if (s.samplesPerPixel > maxSpp) s.samplesPerPixel = maxSpp
      if (s.samplesPerPixel < minSpp) s.samplesPerPixel = minSpp
      const visible = w * s.samplesPerPixel
      if (s.viewLeft < 0) s.viewLeft = 0
      const maxLeft = Math.max(0, s.totalSamples - visible)
      if (s.viewLeft > maxLeft) s.viewLeft = maxLeft
    }

    const updateAutoZoom = () => {
      if (!canvas || !s.autoZoomEnabled || s.totalSamples <= 0) return
      const w = canvas.width
      if (w <= 0) return
      if (s.autoZoomStartedAtMs === 0) s.autoZoomStartedAtMs = performance.now()
      const maxSpp = s.totalSamples / w
      const minSpp = Math.max(0.2, Math.min(0.75, maxSpp * 0.035))
      const cycleMs = 7200
      const phase =
        ((performance.now() - s.autoZoomStartedAtMs) % cycleMs) / cycleMs
      let bounce = 0
      if (phase < 0.6) {
        const t = phase / 0.6
        bounce = 1 - Math.pow(1 - t, 3)
      } else if (phase < 0.82) {
        bounce = 1
      } else {
        const t = (phase - 0.82) / 0.18
        bounce = 0.5 + 0.5 * Math.cos(t * Math.PI)
      }
      s.samplesPerPixel = maxSpp + (minSpp - maxSpp) * bounce
      const visible = w * s.samplesPerPixel
      s.viewLeft = Math.max(0, (s.totalSamples - visible) * 0.5)
    }

    const updateExternalZoom = () => {
      const liveZoomProgress = zoomProgressRef.current
      if (!canvas || liveZoomProgress === null || s.totalSamples <= 0) return
      const w = canvas.width
      if (w <= 0) return
      const maxSpp = s.totalSamples / w
      const minSpp = Math.max(0.8, Math.min(1.5, maxSpp * 0.075))
      const eased = 1 - Math.pow(1 - clamp01(liveZoomProgress), 2)
      s.samplesPerPixel = maxSpp + (minSpp - maxSpp) * eased
      const visible = w * s.samplesPerPixel
      s.viewLeft = Math.max(0, (s.totalSamples - visible) * 0.5)
    }

    const drawCenterAxis = (g: WebGL2RenderingContext, w: number) => {
      const c = s.waveColor
      const data = new Float32Array([0, 0, c[0], c[1], c[2], w, 0, c[0], c[1], c[2]])
      g.bindBuffer(g.ARRAY_BUFFER, s.posVbo)
      g.bufferData(g.ARRAY_BUFFER, data, g.DYNAMIC_DRAW)
      g.enableVertexAttribArray(s.aSampleIdx)
      g.enableVertexAttribArray(s.aValue)
      g.enableVertexAttribArray(s.aColor)
      g.vertexAttribPointer(s.aSampleIdx, 1, g.FLOAT, false, 20, 0)
      g.vertexAttribPointer(s.aValue, 1, g.FLOAT, false, 20, 4)
      g.vertexAttribPointer(s.aColor, 3, g.FLOAT, false, 20, 8)
      g.uniform1i(s.uUseSampleIdx, 0)
      g.uniform1i(s.uUseVertexColor, 0)
      g.uniform1i(s.uIsPoint, 0)
      g.uniform1f(s.uPointSize, 1)
      g.uniform4f(s.uColor, c[0], c[1], c[2], 0.18)
      g.drawArrays(g.LINES, 0, 2)
    }

    const drawEnvelope = (g: WebGL2RenderingContext, w: number, alpha = 1) => {
      const level = Math.max(1, Math.floor(Math.log2(s.samplesPerPixel)))
      const arr = s.pyramid[level] || s.pyramid[s.pyramid.length - 1]
      if (!arr) return
      const binSize = 1 << level
      const numBins = arr.length / 2
      const need = w * 10
      s.envBuf = ensureBuf(s.envBuf, need)
      for (let x = 0; x < w; x++) {
        const sLeft = s.viewLeft + x * s.samplesPerPixel
        const sRight = s.viewLeft + (x + 1) * s.samplesPerPixel
        let bLo = Math.floor(sLeft / binSize)
        let bHi = Math.floor((sRight - 1) / binSize)
        if (bLo < 0) bLo = 0
        if (bHi >= numBins) bHi = numBins - 1
        let mn = 0
        let mx = 0
        if (bLo > bHi) {
          mn = 0
          mx = 0
        } else {
          mn = Infinity
          mx = -Infinity
          for (let b = bLo; b <= bHi; b++) {
            const a = arr[b * 2]
            const c = arr[b * 2 + 1]
            if (a < mn) mn = a
            if (c > mx) mx = c
          }
          if (mx - mn < 1e-4) {
            const mid = (mx + mn) * 0.5
            mn = mid - 1e-3
            mx = mid + 1e-3
          }
        }
        const amp = Math.max(Math.abs(mn), Math.abs(mx))
        const color = amplitudeColor(amp)
        const dst = x * 10
        s.envBuf[dst] = x
        s.envBuf[dst + 1] = mn
        s.envBuf[dst + 2] = color[0]
        s.envBuf[dst + 3] = color[1]
        s.envBuf[dst + 4] = color[2]
        s.envBuf[dst + 5] = x
        s.envBuf[dst + 6] = mx
        s.envBuf[dst + 7] = color[0]
        s.envBuf[dst + 8] = color[1]
        s.envBuf[dst + 9] = color[2]
      }
      g.bindBuffer(g.ARRAY_BUFFER, s.posVbo)
      g.bufferData(g.ARRAY_BUFFER, s.envBuf.subarray(0, need), g.DYNAMIC_DRAW)
      g.enableVertexAttribArray(s.aSampleIdx)
      g.enableVertexAttribArray(s.aValue)
      g.enableVertexAttribArray(s.aColor)
      g.vertexAttribPointer(s.aSampleIdx, 1, g.FLOAT, false, 20, 0)
      g.vertexAttribPointer(s.aValue, 1, g.FLOAT, false, 20, 4)
      g.vertexAttribPointer(s.aColor, 3, g.FLOAT, false, 20, 8)
      g.uniform1i(s.uUseSampleIdx, 0)
      g.uniform1i(s.uUseVertexColor, 1)
      g.uniform1i(s.uIsPoint, 0)
      g.uniform1f(s.uPointSize, 1)
      g.uniform4f(s.uColor, 1, 1, 1, alpha)
      g.drawArrays(g.LINES, 0, w * 2)
    }

    const drawSampleLevel = (
      g: WebGL2RenderingContext,
      w: number,
      alpha = 1,
    ): number => {
      if (!s.rawSamples) return 0
      const margin = 2
      let i0 = Math.floor(s.viewLeft) - margin
      let i1 = Math.ceil(s.viewLeft + w * s.samplesPerPixel) + margin
      if (i0 < 0) i0 = 0
      if (i1 > s.totalSamples) i1 = s.totalSamples
      const n = Math.max(0, i1 - i0)
      if (n < 2) return 0
      const need = n * 5
      s.lineBuf = ensureBuf(s.lineBuf, need)
      for (let i = 0; i < n; i++) {
        const v = s.rawSamples[i0 + i]
        const color = amplitudeColor(Math.abs(v))
        const dst = i * 5
        s.lineBuf[dst] = i0 + i
        s.lineBuf[dst + 1] = v
        s.lineBuf[dst + 2] = color[0]
        s.lineBuf[dst + 3] = color[1]
        s.lineBuf[dst + 4] = color[2]
      }
      const lineAlpha = Math.max(0.15, Math.min(1.0, s.samplesPerPixel * 1.2))
      g.bindBuffer(g.ARRAY_BUFFER, s.posVbo)
      g.bufferData(g.ARRAY_BUFFER, s.lineBuf.subarray(0, need), g.DYNAMIC_DRAW)
      g.enableVertexAttribArray(s.aSampleIdx)
      g.enableVertexAttribArray(s.aValue)
      g.enableVertexAttribArray(s.aColor)
      g.vertexAttribPointer(s.aSampleIdx, 1, g.FLOAT, false, 20, 0)
      g.vertexAttribPointer(s.aValue, 1, g.FLOAT, false, 20, 4)
      g.vertexAttribPointer(s.aColor, 3, g.FLOAT, false, 20, 8)
      g.uniform1i(s.uUseSampleIdx, 1)
      g.uniform1i(s.uUseVertexColor, 1)
      g.uniform1i(s.uIsPoint, 0)
      g.uniform1f(s.uPointSize, 1)
      g.uniform4f(s.uColor, 1, 1, 1, lineAlpha * alpha)
      g.drawArrays(g.LINE_STRIP, 0, n)

      // Stems (Dirac-style at high zoom)
      const stemNeed = n * 10
      s.stemBuf = ensureBuf(s.stemBuf, stemNeed)
      for (let i = 0; i < n; i++) {
        const idx = i0 + i
        const v = s.rawSamples[idx | 0]
        const color = amplitudeColor(Math.abs(v))
        const dst = i * 10
        s.stemBuf[dst] = idx
        s.stemBuf[dst + 1] = 0
        s.stemBuf[dst + 2] = color[0]
        s.stemBuf[dst + 3] = color[1]
        s.stemBuf[dst + 4] = color[2]
        s.stemBuf[dst + 5] = idx
        s.stemBuf[dst + 6] = v
        s.stemBuf[dst + 7] = color[0]
        s.stemBuf[dst + 8] = color[1]
        s.stemBuf[dst + 9] = color[2]
      }
      g.bindBuffer(g.ARRAY_BUFFER, s.posVbo)
      g.bufferData(g.ARRAY_BUFFER, s.stemBuf.subarray(0, stemNeed), g.DYNAMIC_DRAW)
      g.vertexAttribPointer(s.aSampleIdx, 1, g.FLOAT, false, 20, 0)
      g.vertexAttribPointer(s.aValue, 1, g.FLOAT, false, 20, 4)
      g.vertexAttribPointer(s.aColor, 3, g.FLOAT, false, 20, 8)
      const stemAlpha = Math.max(0.4, Math.min(1.0, 1.2 - s.samplesPerPixel * 0.5))
      g.uniform4f(s.uColor, 1, 1, 1, stemAlpha * alpha)
      g.drawArrays(g.LINES, 0, n * 2)

      // Sample dots
      g.bindBuffer(g.ARRAY_BUFFER, s.posVbo)
      g.bufferData(g.ARRAY_BUFFER, s.lineBuf.subarray(0, need), g.DYNAMIC_DRAW)
      g.vertexAttribPointer(s.aSampleIdx, 1, g.FLOAT, false, 20, 0)
      g.vertexAttribPointer(s.aValue, 1, g.FLOAT, false, 20, 4)
      g.vertexAttribPointer(s.aColor, 3, g.FLOAT, false, 20, 8)
      g.uniform1i(s.uIsPoint, 1)
      const spacingPx = 1 / s.samplesPerPixel
      const size = Math.min(28, Math.max(4, spacingPx * 0.55))
      g.uniform1f(s.uPointSize, size * dpr())
      g.uniform4f(s.uColor, 1, 1, 1, alpha)
      g.drawArrays(g.POINTS, 0, n)
      return n
    }

    const render = () => {
      if (!s.gl || !canvas || !s.pyramid.length) return
      resizeCanvas()
      if (zoomProgressRef.current !== null) {
        updateExternalZoom()
      } else {
        updateAutoZoom()
      }
      clampView()
      const g = s.gl
      const w = canvas.width
      const yScale = 0.92
      const bg = s.bgColor
      g.clearColor(bg[0], bg[1], bg[2], bg[3])
      g.clear(g.COLOR_BUFFER_BIT)
      g.useProgram(s.program)
      g.uniform1f(s.uViewLeft, s.viewLeft)
      g.uniform1f(s.uSpp, s.samplesPerPixel)
      g.uniform1f(s.uCanvasW, w)
      g.uniform1f(s.uYScale, yScale)
      drawCenterAxis(g, w)
      const blendStart = 3
      const blendEnd = 5.5
      if (s.samplesPerPixel <= blendStart) {
        drawSampleLevel(g, w, 1)
      } else if (s.samplesPerPixel >= blendEnd) {
        drawEnvelope(g, w, 1)
      } else {
        const t = (s.samplesPerPixel - blendStart) / (blendEnd - blendStart)
        drawSampleLevel(g, w, 1 - t)
        drawEnvelope(g, w, t)
      }
    }

    const tick = () => {
      if (s.playing && s.audioCtx) {
        const t = s.startOffset + (s.audioCtx.currentTime - s.startCtxTime)
        if (t >= s.durationSec) {
          s.currentTimeSec = s.durationSec
          stopSource()
          s.playing = false
          setPlaying(false)
        } else {
          s.currentTimeSec = t
        }
        setCurrentTime(s.currentTimeSec)
      }
      render()
      s.rafHandle = requestAnimationFrame(tick)
    }

    const stopSource = () => {
      if (s.sourceNode) {
        try {
          s.sourceNode.stop()
        } catch {}
        try {
          s.sourceNode.disconnect()
        } catch {}
        s.sourceNode = null
      }
    }

    const load = async () => {
      try {
        s.audioCtx = new (window.AudioContext ||
          // @ts-expect-error vendor prefix
          window.webkitAudioContext)()
        const res = await fetch(src)
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
        const arr = await res.arrayBuffer()
        const buf = await s.audioCtx.decodeAudioData(arr)
        s.audioBuffer = buf
        s.durationSec = buf.duration
        setDuration(buf.duration)
        s.sampleRate = buf.sampleRate
        s.totalSamples = buf.length

        let mono: Float32Array
        if (buf.numberOfChannels === 1) {
          mono = buf.getChannelData(0)
        } else {
          const a = buf.getChannelData(0)
          const b = buf.getChannelData(1)
          mono = new Float32Array(buf.length)
          for (let i = 0; i < buf.length; i++) mono[i] = (a[i] + b[i]) * 0.5
        }
        s.rawSamples = mono
        s.pyramid = buildPyramid(mono)

        if (canvas) {
          s.samplesPerPixel = s.totalSamples / canvas.width
          s.viewLeft = 0
        }
        s.autoZoomStartedAtMs = performance.now()
        setReady(true)
      } catch (e) {
        console.error(e)
      }
    }

    const ro = new ResizeObserver(() => {
      // resize is picked up by render()
    })
    ro.observe(wrap)

    s.rafHandle = requestAnimationFrame(tick)
    void load()

    return () => {
      cancelAnimationFrame(s.rafHandle)
      stopSource()
      ro.disconnect()
      if (s.audioCtx) s.audioCtx.close().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // Pointer / wheel / keyboard handlers
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const s = stateRef.current

    const disableAutoZoom = () => {
      s.autoZoomEnabled = false
    }

    const eventToCanvas = (e: { clientX: number }) => {
      const rect = wrap.getBoundingClientRect()
      if (rect.width <= 0) return null
      const frac = (e.clientX - rect.left) / rect.width
      const px = frac * canvas.width
      return { frac, px }
    }

    const onWheel = (e: WheelEvent) => {
      if (!ready) return
      disableAutoZoom()
      e.preventDefault()
      const hit = eventToCanvas(e)
      if (!hit) return
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) {
        const deltaPx = e.shiftKey && e.deltaX === 0 ? e.deltaY : e.deltaX
        const rect = wrap.getBoundingClientRect()
        const ratio = canvas.width / rect.width
        s.viewLeft += deltaPx * ratio * s.samplesPerPixel
        return
      }
      const sampleAtCursor = s.viewLeft + hit.px * s.samplesPerPixel
      const intensity = Math.min(50, Math.abs(e.deltaY))
      const factor = Math.exp(Math.sign(e.deltaY) * intensity * 0.005)
      s.samplesPerPixel *= factor
      s.viewLeft = sampleAtCursor - hit.px * s.samplesPerPixel
    }

    let dragStart: { frac: number; viewLeft: number } | null = null
    let dragMoved = false
    const onMouseDown = (e: MouseEvent) => {
      if (!ready) return
      disableAutoZoom()
      const hit = eventToCanvas(e)
      if (!hit) return
      dragStart = { frac: hit.frac, viewLeft: s.viewLeft }
      dragMoved = false
      const onMove = (ev: MouseEvent) => {
        if (!dragStart) return
        const h = eventToCanvas(ev)
        if (!h) return
        const dxPx = (h.frac - dragStart.frac) * canvas.width
        if (Math.abs(dxPx) > 3) dragMoved = true
        if (dragMoved) {
          s.viewLeft = dragStart.viewLeft - dxPx * s.samplesPerPixel
        }
      }
      const onUp = (ev: MouseEvent) => {
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        if (!dragMoved) {
          const h = eventToCanvas(ev)
          if (h) {
            const sample = s.viewLeft + h.px * s.samplesPerPixel
            seek(sample / s.sampleRate)
          }
        }
        dragStart = null
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    }

    const seek = (t: number) => {
      const cap = Math.max(0, Math.min(s.durationSec, t))
      const wasPlaying = s.playing
      stopSrc()
      s.currentTimeSec = cap
      s.startOffset = cap
      setCurrentTime(cap)
      if (wasPlaying) void playInternal()
    }

    const stopSrc = () => {
      if (s.sourceNode) {
        try {
          s.sourceNode.stop()
        } catch {}
        try {
          s.sourceNode.disconnect()
        } catch {}
        s.sourceNode = null
      }
    }

    const playInternal = async () => {
      if (!s.audioCtx || !s.audioBuffer) return
      if (s.audioCtx.state === "suspended") {
        try {
          await s.audioCtx.resume()
        } catch (err) {
          console.error("Failed to resume audio context", err)
          return
        }
      }
      if (s.audioCtx.state !== "running") return
      stopSrc()
      const node = s.audioCtx.createBufferSource()
      node.buffer = s.audioBuffer
      node.connect(s.audioCtx.destination)
      const off = Math.max(
        0,
        Math.min(s.currentTimeSec, s.durationSec - 0.001),
      )
      s.startCtxTime = s.audioCtx.currentTime
      s.startOffset = off
      node.start(0, off)
      node.onended = () => {
        if (s.sourceNode === node) {
          s.sourceNode = null
          s.playing = false
          setPlaying(false)
        }
      }
      s.sourceNode = node
      s.playing = true
      setPlaying(true)
    }

    // Expose for buttons via custom events
    const onTogglePlay = () => {
      if (s.playing) {
        s.currentTimeSec =
          s.startOffset + (s.audioCtx ? s.audioCtx.currentTime - s.startCtxTime : 0)
        stopSrc()
        s.startOffset = s.currentTimeSec
        setCurrentTime(s.currentTimeSec)
        s.playing = false
        setPlaying(false)
      } else {
        void playInternal()
      }
    }
    const onZoomFit = () => {
      if (!canvas || !s.totalSamples) return
      disableAutoZoom()
      s.samplesPerPixel = s.totalSamples / canvas.width
      s.viewLeft = 0
    }

    if (interactive) {
      wrap.addEventListener("wheel", onWheel, { passive: false })
      wrap.addEventListener("mousedown", onMouseDown)
      wrap.addEventListener("waveform:toggle", onTogglePlay as EventListener)
      wrap.addEventListener("waveform:fit", onZoomFit as EventListener)
    }

    const onKey = (e: KeyboardEvent) => {
      if (!ready) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === " " || e.key === "k" || e.key === "K") {
        disableAutoZoom()
        e.preventDefault()
        onTogglePlay()
      } else if (e.key === "f" || e.key === "F") {
        disableAutoZoom()
        e.preventDefault()
        onZoomFit()
      } else if (e.key === "ArrowLeft") {
        disableAutoZoom()
        seek(s.currentTimeSec - (e.shiftKey ? 5 : 1))
      } else if (e.key === "ArrowRight") {
        disableAutoZoom()
        seek(s.currentTimeSec + (e.shiftKey ? 5 : 1))
      }
    }
    if (interactive) {
      window.addEventListener("keydown", onKey)
    }

    return () => {
      if (interactive) {
        wrap.removeEventListener("wheel", onWheel)
        wrap.removeEventListener("mousedown", onMouseDown)
        wrap.removeEventListener(
          "waveform:toggle",
          onTogglePlay as EventListener,
        )
        wrap.removeEventListener("waveform:fit", onZoomFit as EventListener)
      }
      if (interactive) {
        window.removeEventListener("keydown", onKey)
      }
    }
  }, [ready, duration, interactive])

  const dispatch = (name: string) =>
    wrapRef.current?.dispatchEvent(new CustomEvent(name))

  return (
    <div
      className={cn("group relative w-full h-full select-none", className)}
      onPointerEnter={() => {
        if (interactive) stateRef.current.autoZoomEnabled = false
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: fallbackBg,
          backgroundImage: fallbackWaveformDataUri(fallbackWave),
          backgroundPosition: "center",
          backgroundRepeat: "repeat-x",
          backgroundSize: "min(720px, 170vw) 100%",
        }}
      />
      <div
        ref={wrapRef}
        className={cn(
          "absolute inset-0",
          interactive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
        )}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full [image-rendering:pixelated]"
        />
      </div>

      {/* Mini neobrutal controls — bottom-left */}
      {showControls && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          disabled={!ready}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => dispatch("waveform:toggle")}
          className="inline-flex items-center justify-center h-9 w-9 rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h4v12H6zM14 6h4v12h-4z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          aria-label="Fit to window"
          disabled={!ready}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => dispatch("waveform:fit")}
          className="inline-flex items-center justify-center h-9 w-9 rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none disabled:opacity-50 disabled:pointer-events-none transition-all"
          title="Fit to window (F)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 9h2V6h3V4H4zm14 0h2V4h-5v2h3zM6 18v-3H4v5h5v-2zm12-3h-2v3h-3v2h5z" />
          </svg>
        </button>
        <span className="hidden sm:inline-block px-2 py-1 rounded-base border-2 border-border bg-secondary-background text-foreground text-xs font-heading tabular-nums shadow-shadow">
          {fmtTime(currentTime)} / {fmtTime(duration)}
        </span>
        </div>
      )}

      {/* Hint chip — top right */}
      {showHint && (
      <div className="pointer-events-none absolute top-3 right-3 z-20 hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
        <span className="px-2 py-1 rounded-base border-2 border-border bg-secondary-background/90 text-foreground text-[10px] font-heading uppercase tracking-wider shadow-shadow">
          scroll to zoom · drag to pan · click to seek
        </span>
      </div>
      )}
    </div>
  )
}
