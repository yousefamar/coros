uniform float uGridSize;
uniform float uDotRadius;
uniform vec3 uDotColor;
uniform float uZoom;

varying vec2 vWorldPos;

void main() {
  float spacing = uGridSize * 3.0;

  vec2 cellCenter = (floor(vWorldPos / spacing) + 0.5) * spacing ;
  vec2 offset = abs(vWorldPos - cellCenter);

  float armLength = uDotRadius * 2.0;
  float armWidth = uDotRadius * 0.15;

  float distAlongArm = max(offset.x, offset.y);
  float distAcrossArm = min(offset.x, offset.y);

  float widthTaper = 1.0 - pow(distAlongArm / armLength, 2.0);
  float targetWidth = armWidth * widthTaper;

  float edgeSoftness = fwidth(distAcrossArm) * 2.0;
  float armShape = smoothstep(targetWidth + edgeSoftness, targetWidth - edgeSoftness, distAcrossArm);

  float lengthFalloff = smoothstep(armLength + edgeSoftness, armLength - edgeSoftness * 2.0, distAlongArm);

  float starShape = armShape * lengthFalloff;

  vec2 gridPoint = (floor(vWorldPos / uGridSize) + 0.5) * uGridSize;
  float dotDist = length(vWorldPos - gridPoint);
  float dotRadius = uDotRadius * 0.3;
  float dotShape = 1.0 - smoothstep(dotRadius - edgeSoftness, dotRadius + edgeSoftness, dotDist);

  float zoomFade = smoothstep(20.0, 60.0, uZoom);

  vec2 starCenter = cellCenter;
  float starCenterDist = length(vWorldPos - starCenter);
  float starDotRadius = uDotRadius * 1.5;
  float starAsDot = 1.0 - smoothstep(starDotRadius - edgeSoftness, starDotRadius + edgeSoftness, starCenterDist);

  float star = mix(starAsDot, starShape, zoomFade);
  float dot = dotShape * zoomFade;

  float combined = max(star, dot);

  if (combined < 0.01) discard;

  gl_FragColor = vec4(uDotColor, combined);
}
