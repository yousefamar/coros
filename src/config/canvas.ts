import type {
  CanvasConfig,
  ZoomConfig,
  GridConfig,
  CameraRigConfig,
} from "../types/canvas";

export const ZOOM_CONFIG: ZoomConfig = {
  min: 10,
  max: 1000,
  speed: 0.1,
  default: 50,
};

export const CAMERA_RIG_CONFIG: CameraRigConfig = {
  cameraDistance: 100,
  pivotRotationX: Math.PI / 4,
};

export const GRID_CONFIG: GridConfig = {
  baseSize: 1,
  color: "#333333",
  planeSize: 1000,
};

export const MARKDOWN_OBJECT_CONFIG = {
  size: {
    width: 1.2,
    height: 0.1,
    depth: 1.6,
  },
  colors: {
    default: "#4a5568",
    hover: "#667eea",
    selected: "#00FF00",
  },
  label: {
    fontSize: 0.15,
    color: "#ffffff",
    offset: 0.2,
  },
};

export const CANVAS_CONFIG: CanvasConfig = {
  camera: {
    position: [0, -10, 10],
    rotation: [Math.PI / 4, 0, 0],
    zoom: ZOOM_CONFIG.default,
    near: 0.1,
    far: 100000,
  },
  background: "#0f0f23",
  lighting: {
    ambient: {
      intensity: 0.6,
    },
    directional: {
      position: [10, 5, 10],
      intensity: 0.4,
    },
  },
};
