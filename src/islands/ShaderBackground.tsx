import { useSyncExternalStore } from "react";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { getPerfMode, onPerfModeChange } from "../lib/perf-mode";
import "./ShaderBackground.css";

/**
 * The reactor. A single WebGL plane behind every panel on the site.
 *
 * This is the one heavy island on the page: it can only run in the browser
 * (`@react-three/fiber` has no SSR path), so it is always mounted with
 * `client:only="react"` and skipped entirely in low-performance mode.
 */
const SHADER_PROPS = {
  animate: "on",
  axesHelper: "off",
  bgColor1: "#000000",
  bgColor2: "#000000",
  brightness: 0.6,
  cAzimuthAngle: 270,
  cDistance: 0.5,
  cPolarAngle: 180,
  cameraZoom: 15.1,
  color1: "#1000c4",
  color2: "#000062",
  color3: "#000ece",
  destination: "onCanvas",
  embedMode: "off",
  envPreset: "city",
  format: "gif",
  fov: 45,
  frameRate: 10,
  gizmoHelper: "hide",
  grain: "on",
  lightType: "env",
  pixelDensity: 1,
  positionX: -0.1,
  positionY: 0,
  positionZ: 0,
  range: "disabled",
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.3,
  rotationX: 0,
  rotationY: 130,
  rotationZ: 70,
  shader: "defaults",
  type: "sphere",
  uAmplitude: 3.2,
  uDensity: 0.8,
  uFrequency: 5.5,
  uSpeed: 0.3,
  uStrength: 0.3,
  uTime: 0,
  wireframe: false,
} as const;

export default function ShaderBackground() {
  const mode = useSyncExternalStore(
    onPerfModeChange,
    getPerfMode,
    () => "high" as const,
  );

  // low-performance mode drops the WebGL context entirely rather than hiding
  // it, so the GPU work stops instead of continuing behind a hidden element
  if (mode === "low") return null;

  return (
    <ShaderGradientCanvas
      className="shaderBackgroundCanvas"
      fov={SHADER_PROPS.fov}
      pixelDensity={SHADER_PROPS.pixelDensity}
      pointerEvents="none"
      style={{ width: "100%", height: "100%" }}
    >
      <ShaderGradient {...SHADER_PROPS} />
    </ShaderGradientCanvas>
  );
}
