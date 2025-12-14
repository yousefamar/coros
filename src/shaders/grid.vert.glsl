varying vec2 vWorldPos;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPosition.xy;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
