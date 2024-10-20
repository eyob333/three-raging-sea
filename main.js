import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertex from './shaders/water/vertex.glsl?raw'
import waterfragmet from './shaders/water/fragmet.glsl?raw'



/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128)

debugObject.deepthColor = '#186691'
debugObject.surfaceColor = '#8bd8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial()
waterMaterial.vertexShader = waterVertex
waterMaterial.fragmentShader = waterfragmet
waterMaterial.uniforms = {
    uBigWavesElevation: {value: .2},
    uBigWavesFrequency: {value: new THREE.Vector2(4.,1.6)},
    uTime: {value: .0 },
    uBigWaveSpeed: {value: .75},
    uDeepthColor: {value: new THREE.Color( debugObject.deepthColor )},
    uSurfaceColor: {value: new THREE.Color( debugObject.surfaceColor )},
    uColorOffSet : {value: .08},
    uColorMultiplier: {value: 5.}

}

gui.add( waterMaterial.uniforms.uBigWavesElevation, 'value').min(.0).max(1.0).step( 0.00001).name('uBigWavesElevation')
gui.add( waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(.0).max(20.0).step( 0.01).name('uBigWavesFrequencyX')
gui.add( waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(.0).max(20.0).step( 0.01).name('uBigWavesFrequencyY')
gui.add( waterMaterial.uniforms.uBigWaveSpeed, 'value').min(.0).max(10.0).step( 0.01).name('uBigWaveSpeed')
gui.addColor( debugObject, 'surfaceColor').name('surfaceColor').onChange( () => { waterMaterial.uniforms.uSurfaceColor.value.set( new THREE.Color(debugObject.surfaceColor) )})
gui.addColor( debugObject, 'deepthColor').name('deepthColor').onChange( () => { waterMaterial.uniforms.uDeepthColor.value.set( new THREE.Color(debugObject.deepthColor) )})
gui.add( waterMaterial.uniforms.uColorMultiplier, 'value').min(.0).max(10.0).step( 0.0001).name('uColorMultiplyier')
gui.add( waterMaterial.uniforms.uColorOffSet, 'value').min(.0).max(10.0).step( 0.0001).name('uColorOffSet')



// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()