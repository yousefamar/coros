import { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { Group, OrthographicCamera } from "three";
import { CAMERA_RIG_CONFIG, ZOOM_CONFIG } from "../config/canvas";

interface CameraRigProps {
  children?: ReactNode;
}

export function CameraRig({ children }: CameraRigProps) {
  const rigRef = useRef<Group>(null);
  const cameraPivotRef = useRef<Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!cameraPivotRef.current) return;

    const cameraPivot = cameraPivotRef.current;
    const orthoCamera = camera as OrthographicCamera;

    orthoCamera.position.set(0, 0, CAMERA_RIG_CONFIG.cameraDistance);
    orthoCamera.lookAt(0, 0, 0);
    orthoCamera.zoom = ZOOM_CONFIG.default;
    orthoCamera.updateProjectionMatrix();

    cameraPivot.add(orthoCamera);

    return () => {
      cameraPivot.remove(orthoCamera);
    };
  }, [camera]);

  return (
    <group ref={rigRef} name="cameraRig">
      {children}
      <group
        ref={cameraPivotRef}
        rotation-x={CAMERA_RIG_CONFIG.pivotRotationX}
      />
    </group>
  );
}
