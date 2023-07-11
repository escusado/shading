const GradientFragmentShader = /*glsl*/ `
varying vec2 vUv;

vec3 colorA = vec3(0.912,1.0,0.652);
vec3 colorB = vec3(1.000,0.777,0.052);

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)
  vec2 normalizedPixel = gl_FragCoord.xy/300.0;
  vec3 color = mix(colorA, colorB, normalizedPixel.y);
  // color = mix(color, vec3(0.000,0.0,0.5), gl_FragCoord.z);

  gl_FragColor = vec4(color,1.0);
}

`;

export default GradientFragmentShader;
