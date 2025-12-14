import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { DotGrid } from "./DotGrid";
import { CameraRig } from "./CameraRig";
import { CanvasControls } from "./CanvasControls";
import { FileSystemManager } from "./FileSystemManager";
import { CANVAS_CONFIG, ZOOM_CONFIG } from "../config/canvas";

export function Canvas() {
  return (
    <div className="w-screen h-screen">
      <ThreeCanvas
        orthographic
        camera={{
          zoom: ZOOM_CONFIG.default,
          near: CANVAS_CONFIG.camera.near,
          far: CANVAS_CONFIG.camera.far,
        }}
        style={{ background: CANVAS_CONFIG.background }}
      >
        <ambientLight intensity={CANVAS_CONFIG.lighting.ambient.intensity} />
        <directionalLight
          position={CANVAS_CONFIG.lighting.directional.position}
          intensity={CANVAS_CONFIG.lighting.directional.intensity}
        />

        <CameraRig>
          <DotGrid />
        </CameraRig>

        <Avatar />
        <FileSystemManager />
        <CanvasControls />
      </ThreeCanvas>
    </div>
  );
}
