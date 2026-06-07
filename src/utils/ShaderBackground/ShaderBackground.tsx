import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import "./ShaderBackground.css";

const shaderGradientProps = {
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
  return (
    <div className="shaderBackground" aria-hidden="true">
      <ShaderGradientCanvas
        className="shaderBackgroundCanvas"
        fov={shaderGradientProps.fov}
        pixelDensity={shaderGradientProps.pixelDensity}
        pointerEvents="none"
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderGradient {...shaderGradientProps} />
      </ShaderGradientCanvas>
    </div>
  );
}
