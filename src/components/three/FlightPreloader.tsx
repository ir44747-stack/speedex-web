/**
 * SPEEDEX — FlightPreloader (Three.js, imperative core)
 * ------------------------------------------------------------------
 * A dark cinematic globe. A procedural SPEEDEX jet (maroon / white,
 * "SPEEDEX" canvas-texture decals on the fuselage) takes off from
 * Beijing, China (39.90°N 116.40°E), flies a great-arc to
 * Doha, Qatar (25.29°N 51.53°E), lands, and the curtain lifts
 * into the homepage. A React-Three-Fiber / Next.js version of this
 * exact scene lives in /nextjs-reference for production handover.
 */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { dict, type Lang } from '../../i18n'

const R = 2.25
const BEIJING = { lat: 39.9042, lon: 116.4074 }
const DOHA = { lat: 25.2854, lon: 51.531 }
const DURATION_MS = 6400

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Procedural SPEEDEX jet — nose toward +Z so basis math stays simple. */
function buildSpeedexJet() {
  const jet = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: 0xf7f1e6, metalness: 0.35, roughness: 0.28 })
  const maroon = new THREE.MeshStandardMaterial({ color: 0x8a1538, metalness: 0.45, roughness: 0.3 })
  const darkGlass = new THREE.MeshStandardMaterial({ color: 0x0a1e3c, metalness: 0.8, roughness: 0.15 })
  const steel = new THREE.MeshStandardMaterial({ color: 0xb8b8be, metalness: 0.9, roughness: 0.25 })

  // Fuselage (capsule along Z)
  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.5, 8, 16), white)
  fuselage.rotation.x = Math.PI / 2
  jet.add(fuselage)
  // Maroon belly stripe
  const stripe = new THREE.Mesh(new THREE.CapsuleGeometry(0.087, 0.42, 4, 12, ), maroon)
  stripe.rotation.x = Math.PI / 2; stripe.position.y = -0.035; stripe.scale.set(0.72, 1, 0.55)
  jet.add(stripe)
  // Cockpit
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12), darkGlass)
  cockpit.position.set(0, 0.035, 0.26); cockpit.scale.set(1, 0.62, 1.15)
  jet.add(cockpit)
  // Main wing + maroon tips
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.014, 0.2), white)
  wing.position.set(0, -0.02, -0.02); wing.rotation.y = 0.18
  jet.add(wing)
  ;[-0.4, 0.4].forEach((x) => {
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.018, 0.16), maroon)
    tip.position.set(x, -0.02, -0.09); tip.rotation.y = 0.18; jet.add(tip)
    // Engines
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16), maroon)
    eng.rotation.x = Math.PI / 2; eng.position.set(x * 0.55, -0.075, 0.02); jet.add(eng)
    const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.012, 16), steel)
    intake.rotation.x = Math.PI / 2; intake.position.set(x * 0.55, -0.075, 0.095); jet.add(intake)
  })
  // Tail fin (maroon) + horizontal stabiliser
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.2, 0.18), maroon)
  fin.position.set(0, 0.1, -0.3); fin.rotation.x = -0.35; jet.add(fin)
  const stab = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.1), maroon)
  stab.position.set(0, 0.03, -0.33); jet.add(stab)

  // "SPEEDEX" fuselage decals — CanvasTexture, both sides
  const c = document.createElement('canvas'); c.width = 1024; c.height = 220
  const g = c.getContext('2d')!
  g.clearRect(0, 0, 1024, 220)
  g.fillStyle = '#8a1538'; g.font = '900 118px "Space Grotesk", Arial, sans-serif'
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SPEEDEX', 512, 96)
  g.fillStyle = '#c9a86a'; g.font = '600 34px Arial'; g.fillText('· CHINA → QATAR ·', 512, 178)
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4
  const decalMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  ;[1, -1].forEach((side) => {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.073), decalMat)
    d.position.set(0.086 * side, 0.018, 0.05); d.rotation.y = (side * Math.PI) / 2
    jet.add(d)
  })
  // Windows
  for (let i = 0; i < 5; i++) {
    ;[1, -1].forEach((side) => {
      const w = new THREE.Mesh(new THREE.CircleGeometry(0.011, 10), darkGlass)
      w.position.set(0.084 * side, 0.045, 0.14 - i * 0.07); w.rotation.y = (side * Math.PI) / 2
      jet.add(w)
    })
  }
  jet.scale.setScalar(1.15)
  return jet
}

export default function FlightPreloader({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const t = dict[lang]
  const mountRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setProgress(100); setLeaving(true)
    window.setTimeout(onDone, 950)
  }
  const finishRef = useRef(finish); finishRef.current = finish

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 1600 : DURATION_MS

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0508, 0.028)
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.05, 7.4)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffe9c4, 0.75))
    const key = new THREE.DirectionalLight(0xe8d5a8, 2.2); key.position.set(4, 3, 5); scene.add(key)
    const rim = new THREE.PointLight(0xb4234a, 30, 20); rim.position.set(-4, -1, 3); scene.add(rim)

    // Stars
    const starPos = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 10)
      starPos.set([v.x, v.y, v.z], i * 3)
    }
    const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xe8d5a8, size: 0.045, transparent: true, opacity: 0.65 })))

    const world = new THREE.Group(); scene.add(world)
    // Globe body + atmosphere
    world.add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0x1c0a13, metalness: 0.25, roughness: 0.75 })))
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.14, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0xc9a86a, transparent: true, opacity: 0.055, side: THREE.BackSide }))
    world.add(atmo)
    // Dotted land-mass feel: fibonacci point sphere
    const N = 2400, pts = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.39996
      pts.set([Math.cos(th) * rad * R * 1.003, y * R * 1.003, Math.sin(th) * rad * R * 1.003], i * 3)
    }
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    world.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xd8b878, size: 0.016, transparent: true, opacity: 0.55 })))
    // Lat / long wireframe
    const lineMat = new THREE.LineBasicMaterial({ color: 0x8a1538, transparent: true, opacity: 0.35 })
    for (let i = 0; i < 12; i++) {
      const circ = new THREE.EllipseCurve(0, 0, R * 1.005, R * 1.005).getPoints(90)
        .map((p) => new THREE.Vector3(p.x, p.y, 0))
      const loop = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circ), lineMat)
      loop.rotation.y = (i * Math.PI) / 12; world.add(loop)
    }

    const start = latLonToVec3(BEIJING.lat, BEIJING.lon, R)
    const end = latLonToVec3(DOHA.lat, DOHA.lon, R)
    const arcPoint = (p: number) => start.clone().lerp(end, p).normalize()
      .multiplyScalar(R + Math.sin(Math.PI * p) * 0.92 + 0.04)

    // Route: full ghost arc + drawn gold trail
    const curvePts = Array.from({ length: 140 }, (_, i) => arcPoint(i / 139))
    const ghost = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curvePts),
      new THREE.LineDashedMaterial({ color: 0xe8d5a8, dashSize: 0.07, gapSize: 0.05, transparent: true, opacity: 0.35 }))
    ghost.computeLineDistances(); world.add(ghost)
    const trailGeo = new THREE.BufferGeometry().setFromPoints(curvePts)
    const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0xe8c87a }))
    trailGeo.setDrawRange(0, 0); world.add(trail)

    // City markers with pulsing rings
    const rings: THREE.Mesh[] = []
    ;[start, end].forEach((pos, idx) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14),
        new THREE.MeshBasicMaterial({ color: idx === 0 ? 0xe8d5a8 : 0xff5c7a }))
      m.position.copy(pos.clone().multiplyScalar(1.01)); world.add(m)
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.07, 0.085, 40),
        new THREE.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: 0.8, side: THREE.DoubleSide }))
      ring.position.copy(m.position); ring.lookAt(pos.clone().multiplyScalar(2)); world.add(ring); rings.push(ring)
    })

    const jet = buildSpeedexJet(); world.add(jet)
    // Bring the Beijing→Doha midpoint to face the camera (+Z)
    const mid = arcPoint(0.5)
    const baseRotY = -Math.atan2(mid.x, mid.z)
    // NOTE: RingGeometry lookAt above uses world space; rings are small enough that this reads correctly once world is rotated.

    const mouse = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = (e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('pointermove', onMove)
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let raf = 0; const t0 = performance.now(); let lastPct = -1
    const upB = new THREE.Vector3(), fwd = new THREE.Vector3(), xA = new THREE.Vector3(), yA = new THREE.Vector3(), m4 = new THREE.Matrix4()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const now = performance.now(), raw = clamp01((now - t0) / duration)
      const pct = Math.round(raw * 100)
      if (pct !== lastPct) { lastPct = pct; setProgress(pct) }

      const p = easeInOutCubic(clamp01((raw - 0.1) / 0.8))
      const pos = arcPoint(p), next = arcPoint(Math.min(p + 0.012, 1))
      jet.position.copy(pos)
      fwd.copy(next).sub(pos).normalize(); upB.copy(pos).normalize()
      xA.crossVectors(upB, fwd).normalize(); yA.crossVectors(fwd, xA)
      m4.makeBasis(xA, yA, fwd); jet.quaternion.setFromRotationMatrix(m4)
      jet.position.y += Math.sin(now * 0.004) * 0.006
      trailGeo.setDrawRange(0, Math.floor(p * 140))
      rings.forEach((r, i) => { const s = 1 + ((now * 0.0012 + i * 0.5) % 1) * 1.6; r.scale.setScalar(s); (r.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - ((now * 0.0012 + i * 0.5) % 1)) })

      world.rotation.y = baseRotY + Math.sin(now * 0.00016) * 0.22 + p * 0.35
      world.rotation.x = 0.18 + mouse.y * 0.05
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.04
      camera.position.y += (1.05 - mouse.y * 0.45 - camera.position.y) * 0.04
      camera.lookAt(0, 0.1, 0)
      renderer.render(scene, camera)
      if (raw >= 1) { cancelAnimationFrame(raf); finishRef.current() }
    }
    tick()
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize)
      renderer.dispose(); mount.removeChild(renderer.domElement)
      scene.traverse((o) => { if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points) { o.geometry?.dispose?.() } })
    }
  }, [])

  const phase = progress < 12 ? t.boarding : progress < 32 ? t.takeoff : progress < 74 ? t.cruise : progress < 96 ? t.descent : t.landed
  const km = Math.round((progress / 100) * 6318).toLocaleString()

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden text-[#f7f1e6]"
      style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #2b0a18 0%, #12050c 55%, #070308 100%)', transform: leaving ? 'translateY(-100%)' : 'none', transition: 'transform .95s cubic-bezier(.76,0,.24,1)' }}
      role="dialog" aria-label="SPEEDEX flight from China to Qatar">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,3,8,.55), transparent 30%, transparent 62%, rgba(7,3,8,.75))' }} />
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-8">
        <div>
          <div className="font-display text-xl font-bold tracking-[.22em]">SPEED<span style={{ color: '#e05575' }}>EX</span></div>
          <div className="mt-1 text-[10px] tracking-[.3em] text-[#e8d5a8]/80">{t.flight_no} · {t.live_route}</div>
        </div>
        <button onClick={finish} className="pointer-events-auto rounded-full border border-[#e8d5a8]/30 px-4 py-2 text-xs tracking-widest transition hover:border-[#e8d5a8] hover:text-[#e8d5a8]">{t.skip}</button>
      </div>
      {/* route labels */}
      <div className="absolute inset-x-0 top-[16%] flex justify-between px-6 sm:px-14">
        <div className="text-start"><div className="font-display text-2xl font-bold sm:text-4xl">北京</div><div className="text-[10px] tracking-[.28em] text-[#e8d5a8]">BEIJING · CHINA</div><div className="mt-1 text-[10px] text-white/50">39.90°N 116.40°E</div></div>
        <div className="text-end"><div className="font-display text-2xl font-bold sm:text-4xl">الدوحة</div><div className="text-[10px] tracking-[.28em] text-[#e8d5a8]">DOHA · QATAR</div><div className="mt-1 text-[10px] text-white/50">25.29°N 51.53°E</div></div>
      </div>
      {/* bottom HUD */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] tracking-[.3em] text-[#e8d5a8]">{phase}</div>
            <div className="mt-1 text-xs text-white/55">{km} / 6,318 KM · {t.drag_hint}</div>
          </div>
          <div className="font-display text-5xl font-bold tabular-nums sm:text-7xl">{progress}<span className="text-2xl text-[#c9a86a]">%</span></div>
        </div>
        <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#8a1538,#e05575,#e8d5a8)', transition: 'width .2s linear' }} />
        </div>
      </div>
    </div>
  )
}
