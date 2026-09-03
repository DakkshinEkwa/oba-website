"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import * as THREE from "three";
import { LANDMASK } from "./landmask";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Tuning. Colors come from the steel accent / ink scales in globals.css
 * so the globe sits on --gradient-hero without introducing saturated color.
 * ------------------------------------------------------------------ */
const PARTICLE_COLOR = "#eff3f5"; // --color-accent-50: continents read white
const MARKER_COLOR = "#68a2e0"; // blue, reserved for the pulsing endpoint rings
const ARC_BASE_COLOR = "#a4b6c0"; // --color-accent-300
const ARC_PULSE_COLOR = "#eff3f5"; // --color-accent-50

const PARTICLE_COUNT = 6500; // dots blanket the whole sphere, land and ocean alike
const OCEAN_ALPHA = 0.2; // ocean dots stay as a faint lattice; land reads on top of it
const ARC_COUNT = 14;
const ARC_SEGMENTS = 64;
const ARC_RADIUS = 0.0026; // gl.lineWidth is clamped to 1px, so arcs are real tubes
const ARC_LIFT = 1.012; // keep tube endpoints clear of the body surface
const MARKER_SIZE = 34; // sprite px for the pulsing endpoint rings
const MARKER_SPEED = 0.5; // ring expansions per second
const RADIUS = 1;
const CAMERA_Z = 3.05;

/** View-space light: fixed relative to the camera, so the lit side stays put while
 *  the continents rotate under it. The sphere's centre sits off the hero's
 *  bottom-right corner, so the on-screen cap is its upper-left, and the light aims
 *  there. With no solid body there is no terminator — this only shades the dots. */
const LIGHT_DIR = new THREE.Vector3(-0.5, 0.45, 0.74).normalize();

const AMBIENT_Y_SPEED = 0.0012; // rad/frame at 60fps
const DRAG_DAMPING = 0.94;
const DRAG_SENSITIVITY = 0.005;
const MAX_TILT = Math.PI / 3;

const DEG2RAD = Math.PI / 180;

/** Canvas and label overlay must share one box, but the scrim sits between them
 *  in the stack, so they are separate elements with identical geometry. */
const GLOBE_BOX =
  "absolute -right-[26%] -bottom-[48%] aspect-square w-[86%] max-w-[760px] xl:-right-[16%] xl:max-w-[960px] 2xl:max-w-[1180px]";

/** Pinned to the globe. As it turns, whichever pin is closest to facing the
 *  camera shows its portrait; the rest stay dark. Coordinates are the named
 *  region, not a precise address. */
const PEOPLE = [
  { name: "Chris Bonsall", lat: 35.5, lon: -79.0, image: "/images/people/chris-bonsall.jpg" },
  { name: "Sean Hanlon", lat: 42.36, lon: -71.06, image: "/images/people/sean-hanlon.jpg" },
  { name: "Christine Lapointe", lat: 28.0, lon: -81.5, image: "/images/people/christine-lapointe.jpg" },
  { name: "Amanda Cardwell", lat: 45.65, lon: 9.6, image: "/images/people/amanda-cardwell.jpg" },
  { name: "Naren Arulrajah", lat: 43.65, lon: -79.38, image: "/images/hosts/naren-arulrajah.jpg" },
];

const PIN_SIZE = 46; // sprite px for the people pins — larger than the arc markers
const PIN_VISIBLE = 0.1; // min facing dot before a pin can own the card
const CARD_MARGIN_X = 52; // half the avatar, so it stays fully on screen
const CARD_MARGIN_TOP = 100; // the avatar stacks upward from its pin
const CARD_SLACK = 48; // a pin just off the visible edge still gets a clamped card

/* ------------------------------------------------------------------ *
 * Landmask
 * ------------------------------------------------------------------ */

/** Unpacks the committed base64 bitmask. Browser-only (`atob`), which is fine:
 *  this module is loaded through next/dynamic with `ssr: false`. */
function decodeLandmask(): Uint8Array {
  const binary = atob(LANDMASK.bits);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Tests a point on the unit sphere against the mask. Inverts the same spherical
 * mapping `rotationForLatLon` solves, so continents and city flights agree:
 *   phi = acos(y), theta = atan2(z, -x)  →  mask column = theta / 2pi.
 */
function isLand(mask: Uint8Array, x: number, y: number, z: number): boolean {
  let theta = Math.atan2(z, -x);
  if (theta < 0) theta += Math.PI * 2;

  const col = Math.min(LANDMASK.w - 1, Math.floor((theta / (Math.PI * 2)) * LANDMASK.w));
  const row = Math.min(
    LANDMASK.h - 1,
    Math.floor((Math.acos(Math.min(1, Math.max(-1, y))) / Math.PI) * LANDMASK.h),
  );

  const index = row * LANDMASK.w + col;
  return ((mask[index >> 3] >> (7 - (index & 7))) & 1) === 1;
}

/* ------------------------------------------------------------------ *
 * Geometry helpers
 * ------------------------------------------------------------------ */

/**
 * Golden-angle (Fibonacci) spiral over the whole sphere. Every point is drawn;
 * the landmask only sets a per-point `land` flag that the shader uses to lift
 * opacity and size, so continents surface out of an otherwise even lattice.
 *
 * `landOnly` is the subset arcs are allowed to start and end on — network arcs
 * springing out of the middle of the Pacific would read as noise.
 */
function spherePoints(count: number, radius: number) {
  const mask = decodeLandmask();
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const positions = new Float32Array(count * 3);
  const land = new Float32Array(count);
  const landOnly: number[] = [];

  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * i + 1) / count;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    positions[i * 3] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;

    if (isLand(mask, x, y, z)) {
      land[i] = 1;
      landOnly.push(x * radius, y * radius, z * radius);
    }
  }

  return { positions, land, landOnly: new Float32Array(landOnly) };
}

/** Point on the unit sphere for (lat, lon), using the same mapping `isLand`
 *  inverts, so pins land where the continents are drawn. */
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * DEG2RAD;
  const theta = (lon + 180) * DEG2RAD;
  return new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta) * radius,
    Math.cos(phi) * radius,
    Math.sin(phi) * Math.sin(theta) * radius,
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Elevated network arcs between land points. Each arc is a QuadraticBezierCurve3
 * whose control point is the pushed-out midpoint, so longer hops rise higher.
 * Rendered as tubes (not lines) because gl.lineWidth is clamped to 1px, and
 * merged into one geometry so the whole set is a single draw call.
 */
function buildArcGeometry(points: Float32Array, count: number) {
  const positions: number[] = [];
  const normals: number[] = [];
  const offsets: number[] = [];
  const speeds: number[] = [];
  const progress: number[] = [];
  const indices: number[] = [];
  const endpoints: number[] = [];
  let vertexOffset = 0;

  const total = points.length / 3;
  const pick = () => Math.floor(Math.random() * total);
  const at = (i: number) =>
    new THREE.Vector3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]).multiplyScalar(ARC_LIFT);

  for (let a = 0; a < count; a++) {
    let start = at(pick());
    let end = at(pick());
    // Reject near-antipodal or near-identical pairs: both degenerate visually.
    let guard = 0;
    while (guard++ < 12) {
      const dot = start.clone().normalize().dot(end.clone().normalize());
      if (dot < 0.75 && dot > -0.7) break;
      start = at(pick());
      end = at(pick());
    }

    const chord = start.distanceTo(end);
    const control = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(RADIUS * (1 + 0.32 * chord));

    endpoints.push(start.x, start.y, start.z, end.x, end.y, end.z);

    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    const tube = new THREE.TubeGeometry(curve, ARC_SEGMENTS, ARC_RADIUS, 6, false);

    const tubePos = tube.attributes.position.array as Float32Array;
    const tubeNormal = tube.attributes.normal.array as Float32Array;
    // TubeGeometry's uv.x is the along-curve parameter, so progress comes free.
    const tubeUv = tube.attributes.uv.array as Float32Array;
    const tubeIndex = tube.index!.array;

    const offset = Math.random();
    const speed = 0.16 + Math.random() * 0.14;

    for (let v = 0; v < tubePos.length / 3; v++) {
      positions.push(tubePos[v * 3], tubePos[v * 3 + 1], tubePos[v * 3 + 2]);
      normals.push(tubeNormal[v * 3], tubeNormal[v * 3 + 1], tubeNormal[v * 3 + 2]);
      progress.push(tubeUv[v * 2]);
      offsets.push(offset);
      speeds.push(speed);
    }
    for (let i = 0; i < tubeIndex.length; i++) indices.push(tubeIndex[i] + vertexOffset);
    vertexOffset += tubePos.length / 3;

    tube.dispose();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
  geometry.setAttribute("aProgress", new THREE.BufferAttribute(new Float32Array(progress), 1));
  geometry.setAttribute("aOffset", new THREE.BufferAttribute(new Float32Array(offsets), 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(new Float32Array(speeds), 1));
  geometry.setIndex(indices);

  // Pulsing rings sit at the arc endpoints, one phase offset each.
  const markerGeometry = new THREE.BufferGeometry();
  markerGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(endpoints), 3));
  markerGeometry.setAttribute(
    "aOffset",
    new THREE.BufferAttribute(
      Float32Array.from({ length: endpoints.length / 3 }, () => Math.random()),
      1,
    ),
  );

  return { geometry, markerGeometry };
}

/* ------------------------------------------------------------------ *
 * Shaders
 *
 * The globe is a see-through dot shell with no solid body, so nothing writes
 * depth and nothing occludes the far hemisphere. Each layer therefore fades
 * itself out as it turns away (`vFacing`, the view-space normal's z) — that fade
 * IS the depth cue. A shared view-space light drives brightness on top of it.
 * ------------------------------------------------------------------ */

const PARTICLE_VERT = /* glsl */ `
  attribute float aLand;
  uniform float uSize;
  uniform float uDpr;
  uniform vec3 uLightDir;
  varying float vShade;
  varying float vFacing;
  varying float vLand;
  void main() {
    // A point on a unit sphere is its own normal.
    vec3 viewNormal = normalize(normalMatrix * position);
    vShade = smoothstep(-0.25, 0.85, dot(viewNormal, uLightDir));
    vFacing = viewNormal.z;
    vLand = aLand;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    // Ocean dots also sit a touch smaller, so land reads as raised, not just brighter.
    gl_PointSize = uSize * uDpr * mix(0.78, 1.0, aLand) * (2.6 / max(0.001, -mv.z));
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOceanAlpha;
  varying float vShade;
  varying float vFacing;
  varying float vLand;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float edge = smoothstep(0.25, 0.06, d);
    // Far-side dots fade instead of being occluded — the sphere is hollow.
    float facing = smoothstep(-0.6, 0.3, vFacing);
    // Ocean is the same white, just dimmed; only the land dots carry full weight.
    float alpha = edge * mix(0.07, 1.0, facing) * mix(uOceanAlpha, 1.0, vLand);
    gl_FragColor = vec4(uColor * mix(0.62, 1.0, vShade), alpha);
  }
`;

const ARC_VERT = /* glsl */ `
  attribute float aProgress;
  attribute float aOffset;
  attribute float aSpeed;
  uniform vec3 uLightDir;
  varying float vProgress;
  varying float vOffset;
  varying float vSpeed;
  varying float vShade;
  varying float vFacing;
  void main() {
    vProgress = aProgress;
    vOffset = aOffset;
    vSpeed = aSpeed;
    vShade = smoothstep(-0.6, 1.0, dot(normalize(normalMatrix * normal), uLightDir));
    vFacing = normalize(normalMatrix * position).z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ARC_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uPulse;
  varying float vProgress;
  varying float vOffset;
  varying float vSpeed;
  varying float vShade;
  varying float vFacing;
  void main() {
    float head = fract(uTime * vSpeed + vOffset);
    float d = vProgress - head;
    d = d - floor(d + 0.5);            // wrap into [-0.5, 0.5]
    float pulse = smoothstep(0.13, 0.0, abs(d));
    float ends = smoothstep(0.0, 0.09, vProgress) * smoothstep(1.0, 0.91, vProgress);
    float facing = mix(0.05, 1.0, smoothstep(-0.5, 0.25, vFacing));
    vec3 color = mix(uBase, uPulse, pulse) * mix(0.55, 1.0, vShade);
    gl_FragColor = vec4(color, (0.34 + 0.9 * pulse) * ends * facing);
  }
`;

const MARKER_VERT = /* glsl */ `
  attribute float aOffset;
  uniform float uSize;
  uniform float uDpr;
  varying float vOffset;
  varying float vFacing;
  void main() {
    vOffset = aOffset;
    vFacing = normalize(normalMatrix * position).z;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uDpr * (2.6 / max(0.001, -mv.z));
  }
`;

const MARKER_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor;
  varying float vOffset;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;   // 0 at centre, 1 at sprite edge
    float core = smoothstep(0.20, 0.10, d);
    // Ring expands outward and fades as it goes, restarting each cycle.
    float t = fract(uTime * uSpeed + vOffset);
    float ring = smoothstep(0.09, 0.0, abs(d - mix(0.14, 0.92, t))) * (1.0 - t);
    float alpha = max(core, ring * 0.85) * mix(0.0, 1.0, smoothstep(-0.1, 0.35, vFacing));
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function HeroGlobe() {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<(HTMLImageElement | null)[]>([]);
  const globeRef = useRef<THREE.Group | null>(null);
  const reduceMotion = useReducedMotion();
  const reduceMotionRef = useRef(false);

  // useReducedMotion() is null on the first render, so mirror it into a ref the
  // rAF loop can read without re-running the (deliberately deps-free) setup.
  useEffect(() => {
    reduceMotionRef.current = reduceMotion === true;
  }, [reduceMotion]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the hero gradient stands on its own.
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const globe = new THREE.Group();
    globe.rotation.x = 0.22;
    globe.rotation.y = -1.6; // brings the pins into the visible limb near load
    scene.add(globe);
    globeRef.current = globe;

    const lightUniform = { value: LIGHT_DIR };

    // Opaque body. This is what makes it read as a sphere: it hides the far
    // hemisphere (occlusion is the strongest depth cue we have) and gives the
    // points and arcs a uniform dark backdrop, which is what the varying hero
    // gradient could never do.
    // Dot lattice over the whole sphere; the land flag makes continents surface.
    const { positions: particlePositions, land: landFlags, landOnly } = spherePoints(
      PARTICLE_COUNT,
      RADIUS,
    );
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("aLand", new THREE.BufferAttribute(landFlags, 1));
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(PARTICLE_COLOR) },
        uOceanAlpha: { value: OCEAN_ALPHA },
        uSize: { value: 3.9 },
        uDpr: { value: dpr },
        uLightDir: lightUniform,
      },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.renderOrder = 0;
    globe.add(particles);

    // Arcs
    const { geometry: arcGeometry, markerGeometry } = buildArcGeometry(landOnly, ARC_COUNT);
    const arcMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBase: { value: new THREE.Color(ARC_BASE_COLOR) },
        uPulse: { value: new THREE.Color(ARC_PULSE_COLOR) },
        uLightDir: lightUniform,
      },
      vertexShader: ARC_VERT,
      fragmentShader: ARC_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const arcs = new THREE.Mesh(arcGeometry, arcMaterial);
    arcs.renderOrder = 1;
    globe.add(arcs);

    // Endpoint markers
    const markerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: MARKER_SPEED },
        uSize: { value: MARKER_SIZE },
        uDpr: { value: dpr },
        uColor: { value: new THREE.Color(MARKER_COLOR) },
      },
      vertexShader: MARKER_VERT,
      fragmentShader: MARKER_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const markers = new THREE.Points(markerGeometry, markerMaterial);
    markers.renderOrder = 2;
    globe.add(markers);

    // People pins — same pulsing ring, larger, so they outrank the arc endpoints.
    const pinVectors = PEOPLE.map((person) => latLonToVector3(person.lat, person.lon, ARC_LIFT));
    const pinGeometry = new THREE.BufferGeometry();
    pinGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        Float32Array.from(pinVectors.flatMap((v) => [v.x, v.y, v.z])),
        3,
      ),
    );
    pinGeometry.setAttribute(
      "aOffset",
      new THREE.BufferAttribute(Float32Array.from(PEOPLE, (_, i) => i / PEOPLE.length), 1),
    );
    const pinMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: MARKER_SPEED },
        uSize: { value: PIN_SIZE },
        uDpr: { value: dpr },
        uColor: { value: new THREE.Color(MARKER_COLOR) },
      },
      vertexShader: MARKER_VERT,
      fragmentShader: MARKER_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const pins = new THREE.Points(pinGeometry, pinMaterial);
    pins.renderOrder = 3;
    globe.add(pins);

    // Drag state
    const velocity = { x: 0, y: 0 };
    let dragging = false;
    let lastPointer = { x: 0, y: 0 };

    const el = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      velocity.x = 0;
      velocity.y = 0;
      el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      velocity.y = (e.clientX - lastPointer.x) * DRAG_SENSITIVITY;
      velocity.x = (e.clientY - lastPointer.y) * DRAG_SENSITIVITY;
      lastPointer = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    // Sizing. lastX/lastY gate redraws when motion is reduced; resize invalidates
    // them so a new viewport always repaints.
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    // Local to the effect, not a ref: a ref survives effect re-runs (StrictMode's
    // double mount, every hot reload) while the DOM is re-created with opacity 0,
    // so the change-gate would skip the write and no avatar would ever show.
    let lastActive = -2;

    // The canvas bleeds past the hero, so most of it is never on screen. Cards
    // may only be placed inside this box, in canvas-local pixels.
    let visible = { x0: 0, y0: 0, x1: 0, y1: 0 };
    const updateVisible = () => {
      const r = host.getBoundingClientRect();
      visible = {
        x0: Math.max(0, -r.left),
        y0: Math.max(0, -r.top),
        x1: Math.min(r.width, window.innerWidth - r.left),
        y1: Math.min(r.height, window.innerHeight - r.top),
      };
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      updateVisible();
      lastX = Number.NaN; // force a redraw at the new size
    };
    window.addEventListener("scroll", updateVisible, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    // Render loop, paused while offscreen
    let frame = 0;
    let running = false;
    let elapsed = 0;
    let lastFrameTime = performance.now();
    const projected = new THREE.Vector3();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1); // clamp tab-restore jumps
      lastFrameTime = now;

      if (reduceMotionRef.current) {
        // Static frame: only redraw if something actually moved it.
        if (globe.rotation.x === lastX && globe.rotation.y === lastY) return;
      } else {
        elapsed += delta;
        arcMaterial.uniforms.uTime.value = elapsed;
        markerMaterial.uniforms.uTime.value = elapsed;
        pinMaterial.uniforms.uTime.value = elapsed;
        if (!dragging) {
          velocity.x *= DRAG_DAMPING;
          velocity.y *= DRAG_DAMPING;
        }
        globe.rotation.y += velocity.y + AMBIENT_Y_SPEED;
        globe.rotation.x = clamp(globe.rotation.x + velocity.x, -MAX_TILT, MAX_TILT);
      }

      // The card goes to the front-most pin that is ALSO somewhere the viewer can
      // see it. Picking purely by facing puts cards at the sphere's centre, which
      // sits off the bottom-right corner of the hero. The test is deliberately
      // loose and the result clamped: rejecting on the exact margins let each pin
      // qualify for only a second or two per rotation, and left pins below ~30°N
      // permanently just under the bottom edge.
      let bestIndex = -1;
      let bestFacing = PIN_VISIBLE;
      let bestX = 0;
      let bestY = 0;
      for (let i = 0; i < pinVectors.length; i++) {
        projected.copy(pinVectors[i]).applyEuler(globe.rotation);
        const facing = projected.z; // camera sits on +z looking at the origin
        if (facing <= bestFacing) continue;

        projected.project(camera);
        const x = (projected.x * 0.5 + 0.5) * host.clientWidth;
        const y = (-projected.y * 0.5 + 0.5) * host.clientHeight;
        if (x < visible.x0 - CARD_SLACK || x > visible.x1 + CARD_SLACK) continue;
        if (y < visible.y0 - CARD_SLACK || y > visible.y1 + CARD_SLACK) continue;

        bestFacing = facing;
        bestIndex = i;
        bestX = x;
        bestY = y;
      }

      // Driven straight from the loop rather than React state — the loop already
      // owns the label's transform and opacity.
      if (bestIndex !== lastActive) {
        avatarRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === bestIndex ? "1" : "0";
        });
        lastActive = bestIndex;
      }

      const label = labelRef.current;
      if (label) {
        if (bestIndex === -1) {
          label.style.opacity = "0";
        } else {
          // Clamp so the avatar is never half off the hero.
          const cx = clamp(bestX, visible.x0 + CARD_MARGIN_X, visible.x1 - CARD_MARGIN_X);
          const cy = clamp(bestY, visible.y0 + CARD_MARGIN_TOP, visible.y1 - 8);
          label.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
          // Ease in as the pin swings to the front, out again as it leaves.
          label.style.opacity = String(Math.min(1, (bestFacing - PIN_VISIBLE) / 0.25));
        }
      }

      lastX = globe.rotation.x;
      lastY = globe.rotation.y;
      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastFrameTime = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    intersectionObserver.observe(host);
    renderer.render(scene, camera); // paint one frame immediately

    return () => {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateVisible);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      particleGeometry.dispose();
      particleMaterial.dispose();
      arcGeometry.dispose();
      arcMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      pinGeometry.dispose();
      pinMaterial.dispose();
      renderer.dispose();
      el.remove();
      globeRef.current = null;
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Oversized sphere bleeding off the hero's bottom-right corner. */}
      <div
        ref={canvasHostRef}
        aria-hidden="true"
        className={cn(GLOBE_BOX, "pointer-events-auto cursor-grab touch-none active:cursor-grabbing")}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,18,32,0.5) 0%, rgba(11,18,32,0.38) 32%, rgba(11,18,32,0.16) 52%, rgba(11,18,32,0.04) 70%, rgba(11,18,32,0) 86%)",
        }}
      />

      <div className={cn(GLOBE_BOX, "pointer-events-none")}>
        <div ref={labelRef} className="absolute top-0 left-0 opacity-0 will-change-transform">
          <span
            aria-hidden="true"
            className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#68a2e0] shadow-[0_0_12px_rgba(104,162,224,0.95)]"
          />
          {/* All five are mounted so their photos are already decoded when a pin
              swings to the front; only the active one is opaque. */}
          {PEOPLE.map((person, i) => (
            <Image
              key={person.name}
              ref={(el) => {
                avatarRefs.current[i] = el;
              }}
              src={person.image}
              alt=""
              aria-hidden="true"
              width={80}
              height={80}
              style={{ opacity: 0 }}
              // No CSS transition here on purpose: the container's opacity already
              // eases with the pin's facing every frame, so the fade is driven by the
              // render loop rather than by a separate animation timeline.
              // max-w-none is load-bearing: the global `img { max-width: 100% }` resolves
              // against this zero-width positioning anchor and would clamp the avatar to 0.
              className="absolute bottom-4 left-0 h-20 w-20 max-w-none -translate-x-1/2 rounded-full object-cover shadow-xl ring-1 ring-white/25"
            />
          ))}
        </div>
      </div>

      {/* The globe is decorative and has no controls, so the names it surfaces
          would otherwise be invisible to assistive tech. */}
      <p className="sr-only">
        Ophthalmology Business Academy contributors shown on the globe:{" "}
        {PEOPLE.map((person) => person.name).join(", ")}.
      </p>
    </div>
  );
}
