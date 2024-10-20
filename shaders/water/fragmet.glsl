uniform vec3 uSurfaceColor;
uniform vec3 uDeepthColor;
uniform float uColorOffSet;
uniform float uColorMultiplier;

varying float vElevation;

void main(){
    // float elevation = step()
    float mixStrength = (vElevation  + uColorOffSet) * uColorMultiplier ;
    vec3 color = mix( uDeepthColor, uSurfaceColor, mixStrength );
    gl_FragColor = vec4( color, 1. );
}