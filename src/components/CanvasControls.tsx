import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "three";
import type { CameraPosition, MousePosition } from "../types/canvas";
import { ZOOM_CONFIG } from "../config/canvas";
import { clamp } from "../utils/canvas";

export function CanvasControls() {
  const { camera, gl, scene } = useThree();
  const isDragging = useRef(false);
  const lastMouse = useRef<MousePosition>({ x: 0, y: 0 });
  const pivotPos = useRef<CameraPosition>({ x: 0, z: 0 });
  const zoom = useRef(ZOOM_CONFIG.default);

  useEffect(() => {
    const canvas = gl.domElement;
    const pivot = scene.getObjectByName("cameraRig");

    if (!pivot) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;

      const moveSpeed = 1 / zoom.current;
      pivotPos.current.x -= deltaX * moveSpeed;
      pivotPos.current.z -= deltaY * moveSpeed;

      pivot.position.x = pivotPos.current.x;
      pivot.position.z = pivotPos.current.z;

      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor =
        e.deltaY > 0 ? 1 - ZOOM_CONFIG.speed : 1 + ZOOM_CONFIG.speed;

      zoom.current *= zoomFactor;
      zoom.current = clamp(zoom.current, ZOOM_CONFIG.min, ZOOM_CONFIG.max);

      const orthoCamera = camera as OrthographicCamera;
      orthoCamera.zoom = zoom.current;
      orthoCamera.updateProjectionMatrix();
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl, scene]);

  return null;
}
