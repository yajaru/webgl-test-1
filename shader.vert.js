attribute float height;
varying lowp vec4 vColor;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    vColor = vec4(-(height * height * 9.0) + 1.0, -((height - 0.5) * (height - 0.5) * 9.0) + 1.0, -((height - 1.0) * (height - 1.0) * 9.0) + 1.0, 0.1);
}
