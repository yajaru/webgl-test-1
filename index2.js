var GOLDEN_RATIO = 1.61803398875;

var NUM_ICOSOHEDRON_VERTS = 12;
var ICOSOHEDRON_VERTS = [
    new THREE.Vector3(-1.0, GOLDEN_RATIO, 0.0),
    new THREE.Vector3(1.0, GOLDEN_RATIO, 0.0),
    new THREE.Vector3(-1.0, -GOLDEN_RATIO, 0.0),
    new THREE.Vector3(1.0, -GOLDEN_RATIO, 0.0),

    new THREE.Vector3(0.0, -1.0, GOLDEN_RATIO),
    new THREE.Vector3(0.0, 1.0, GOLDEN_RATIO),
    new THREE.Vector3(0.0, -1.0, -GOLDEN_RATIO),
    new THREE.Vector3(0.0, 1.0, -GOLDEN_RATIO),

    new THREE.Vector3(GOLDEN_RATIO, 0.0, -1.0),
    new THREE.Vector3(GOLDEN_RATIO, 0.0, 1.0),
    new THREE.Vector3(-GOLDEN_RATIO, 0.0, -1.0),
    new THREE.Vector3(-GOLDEN_RATIO, 0.0, 1.0)
]

var NUM_ICOSOHEDRON_INDICES = 60;
var ICOSOHEDRON_INDICES = [
    0, 11, 5,
    0, 5, 1,
    0, 1, 7,
    0, 7, 10,
    0, 10, 11,

    1, 5, 9,
    5, 11, 4,
    11, 10, 2,
    10, 7, 6,
    7, 1, 8,

    3, 9, 4,
    3, 4, 2,
    3, 2, 6,
    3, 6, 8,
    3, 8, 9,

    4, 9, 5,
    2, 4, 11,
    6, 2, 10,
    8, 6, 7,
    9, 8, 1
];

function findMidpoint(a, b) {
    return new THREE.Vector3().addVectors(a, b).divideScalar(2.0).normalize();
}

function generateIcosphereMesh( lod ) {
    var indices = [];
    vertexLookup = {}

    for( i = 0; i < NUM_ICOSOHEDRON_INDICES; ++i ) {
        indices[i] = ICOSOHEDRON_INDICES[i];
    }
}

console.log(findMidpoint(new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 2, 2)));

class Planet {
    constructor() {
        this.geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
    }
}


window.onload = function() {
    // create our rendering elements and tools
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scene.add(camera);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );

    planetX = new Planet();
    scene.add( planetX.mesh );

    scene.add( new THREE.AxisHelper( 5 ) );

    // // create a light to see by
    // var pointLight = new THREE.PointLight(0xFFFFFF);
    // pointLight.position.set( 5000, 2000, 50 );
    // scene.add(pointLight);

    // raise camera above plane
    camera.position.z = 30;

    function render() {
        renderer.render( scene, camera );
        planetX.mesh.rotation.y += 0.004;
        planetX.mesh.rotation.x += 0.002;
        planetX.mesh.rotation.z += 0.001;
        requestAnimationFrame( render );
    }
    render();
}
