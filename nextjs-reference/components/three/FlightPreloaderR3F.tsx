// @ts-nocheck
/**
 * ============================================================================
 * SPEEDEX — Production Next.js / React Three Fiber version of the pre-loader
 * ============================================================================
 * This is the drop-in R3F equivalent of src/components/three/FlightPreloader.tsx
 * for the Next.js App Router production build. It is kept OUT of the Vite
 * demo's tsconfig (see tsconfig.app.json) so the demo runs without R3F deps.
 *
 * Install in the Next.js app:
 *   npm i three @react-three/fiber @react-three/drei gsap
 *   npm i -D @types/three
 *
 * Usage (app/[locale]/page.tsx):
 *   const FlightPreloader = dynamic(() => import('@/components/three/FlightPreloaderR3F'), { ssr: false })
 *   const [landed, setLanded] = useState(false)
 *   return <>{!landed && <FlightPreloader onLanded={() => setLanded(true)} />}<HomeStory dimmed={!landed} /></>
 *
 * Swap the procedural <SpeedexJet/> for a modelled GLB at production:
 *   const { scene } = useGLTF('/models/speedex-jet.glb')  // maroon/white, SPEEDEX livery baked in Blender
 *   return <primitive object={scene} />
 * — the flight-path math below stays identical.
 */
'use client'

import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, PerspectiveCamera, Stars } from '@react-three/drei'

export const ROUTE = {
  BEIJING: { lat: 39.9042, lon: 116.4074, label: 'BEIJING · CHINA' },
  DOHA: { lat: 25.2854, lon: 51.531, label: 'DOHA · QATAR' },
  DISTANCE_KM: 6318,
} as const

const R = 2.25
const DURATION = 6.4 // seconds

export function latLonToVec3(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}
const START = latLonToVec3(ROUTE.BEIJING.lat, ROUTE.BEIJING.lon)
const END = latLonToVec3(ROUTE.DOHA.lat, ROUTE.DOHA.lon)
export const arcPoint = (t: number) =>
  START.clone().lerp(END, t).normalize().multiplyScalar(R + Math.sin(Math.PI * t) * 0.92 + 0.04)

/** Procedural maroon/white jet with SPEEDEX canvas-texture fuselage decals. Nose = +Z. */
export function SpeedexJet(props: JSX.IntrinsicElements['group']) {
  const decal = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 220
    const g = c.getContext('2d')!
    g.fillStyle = '#8a1538'; g.font = '900 118px "Space Grotesk", Arial'; g.textAlign = 'center'
    g.fillText('SPEEDEX', 512, 118)
    g.fillStyle = '#c9a86a'; g.font = '600 34px Arial'; g.fillText('· CHINA → QATAR ·', 512, 182)
    return new THREE.CanvasTexture(c)
  }, [])
  const white = <meshStandardMaterial color="#f7f1e6" metalness={0.35} roughness={0.28} />
  const maroon = <meshStandardMaterial color="#8a1538" metalness={0.45} roughness={0.3} />
  return (
    <group {...props} scale={1.15}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.085, 0.5, 8, 16]} />{white}</mesh>
      <mesh position={[0, 0.035, 0.26]} scale={[1, 0.62, 1.15]}><sphereGeometry args={[0.062, 16, 12]} /><meshStandardMaterial color="#0a1e3c" metalness={0.8} roughness={0.15} /></mesh>
      <mesh position={[0, -0.02, -0.02]} rotation={[0, 0.18, 0]}><boxGeometry args={[0.78, 0.014, 0.2]} />{white}</mesh>
      <mesh position={[0, 0.1, -0.3]} rotation={[-0.35, 0, 0]}><boxGeometry args={[0.016, 0.2, 0.18]} />{maroon}</mesh>
      <mesh position={[0, 0.03, -0.33]}><boxGeometry args={[0.3, 0.012, 0.1]} />{maroon}</mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, -0.075, 0.02]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.14, 16]} />{maroon}</mesh>
      ))}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0.086 * s, 0.018, 0.05]} rotation={[0, (s * Math.PI) / 2, 0]}>
          <planeGeometry args={[0.34, 0.073]} /><meshBasicMaterial map={decal} transparent />
        </mesh>
      ))}
    </group>
  )
}

function FlightScene({ onProgress, onLanded }: { onProgress: (p: number) => void; onLanded: () => void }) {
  const world = useRef<THREE.Group>(null!)
  const jet = useRef<THREE.Group>(null!)
  const landed = useRef(false)
  const ghostPts = useMemo(() => Array.from({ length: 140 }, (_, i) => arcPoint(i / 139)), [])
  const baseRotY = useMemo(() => -Math.atan2(arcPoint(0.5).x, arcPoint(0.5).z), []) // face route to camera
  const dots = useMemo(() => {
    const N = 2400, arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.39996; arr.set([Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R], i * 3) }
    return arr
  }, [])
  const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const tmp = useMemo(() => ({ fwd: new THREE.Vector3(), up: new THREE.Vector3(), x: new THREE.Vector3(), y: new THREE.Vector3(), m: new THREE.Matrix4() }), [])

  useFrame(({ clock, pointer, camera }) => {
    const raw = Math.min(1, clock.elapsedTime / DURATION)
    onProgress(Math.round(raw * 100))
    const p = ease(THREE.MathUtils.clamp((raw - 0.1) / 0.8, 0, 1))
    const pos = arcPoint(p), next = arcPoint(Math.min(p + 0.012, 1))
    jet.current.position.copy(pos)
    tmp.fwd.copy(next).sub(pos).normalize(); tmp.up.copy(pos).normalize()
    tmp.x.crossVectors(tmp.up, tmp.fwd).normalize(); tmp.y.crossVectors(tmp.fwd, tmp.x)
    tmp.m.makeBasis(tmp.x, tmp.y, tmp.fwd); jet.current.quaternion.setFromRotationMatrix(tmp.m)
    world.current.rotation.y = baseRotY + Math.sin(clock.elapsedTime * 0.16) * 0.22 + p * 0.35
    world.current.rotation.x = 0.18 - pointer.y * 0.05
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.7, 0.04)
    camera.lookAt(0, 0.1, 0)
    if (raw >= 1 && !landed.current) { landed.current = true; onLanded() }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.05, 7.4]} fov={42} />
      <ambientLight intensity={0.75} color="#ffe9c4" />
      <directionalLight position={[4, 3, 5]} intensity={2.2} color="#e8d5a8" />
      <pointLight position={[-4, -1, 3]} intensity={30} color="#b4234a" />
      <Stars radius={16} depth={8} count={900} factor={3} fade />
      <group ref={world}>
        <mesh><sphereGeometry args={[R, 48, 48]} /><meshStandardMaterial color="#1c0a13" metalness={0.25} roughness={0.75} /></mesh>
        <points>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[dots, 3]} /></bufferGeometry>
          <pointsMaterial color="#d8b878" size={0.016} transparent opacity={0.55} />
        </points>
        <Line points={ghostPts} color="#e8d5a8" lineWidth={1} dashed dashSize={0.07} gapSize={0.05} transparent opacity={0.35} />
        {[START, END].map((pos, i) => (
          <mesh key={i} position={pos.clone().multiplyScalar(1.01)}><sphereGeometry args={[0.045, 14, 14]} /><meshBasicMaterial color={i ? '#ff5c7a' : '#e8d5a8'} /></mesh>
        ))}
        <group ref={jet}><SpeedexJet /></group>
      </group>
    </>
  )
}

export default function FlightPreloaderR3F({ onLanded }: { onLanded: () => void }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const finish = () => { setLeaving(true); setTimeout(onLanded, 950) }
  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0508] text-[#f7f1e6] transition-transform duration-[950ms] ease-[cubic-bezier(.76,0,.24,1)]"
      style={{ transform: leaving ? 'translateY(-100%)' : 'none' }} role="dialog" aria-label="SPEEDEX flight from China to Qatar">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={<Html center>…</Html>}>
          <FlightScene onProgress={setProgress} onLanded={finish} />
        </Suspense>
      </Canvas>
      <button onClick={finish} className="absolute end-6 top-6 rounded-full border border-[#e8d5a8]/30 px-4 py-2 text-xs tracking-widest">Skip flight →</button>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="mb-2 flex items-end justify-between text-xs tracking-[.25em] text-[#e8d5a8]">
          <span>BEIJING 北京 → DOHA الدوحة · {Math.round((progress / 100) * ROUTE.DISTANCE_KM).toLocaleString()} KM</span>
          <span className="text-5xl font-bold tracking-normal text-white">{progress}%</span>
        </div>
        <div className="h-[3px] rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#8a1538] via-[#e05575] to-[#e8d5a8]" style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  )
}
