

window.onload = function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight);

    camera.position.z = 5;
    document.onmousemove = function(event) {
        var mousex = event.clientX - document.body.clientWidth / 2;
        var mousey = event.clientY - document.body.clientHeight / 2;
        var mousez = 90;
        var mouseVector = new THREE.Vector3(mousex, -mousey, mousez);
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(cube.position, mouseVector, new THREE.Vector3(0,0,0));
        cube.rotation.setFromRotationMatrix(rotationMatrix);
    }

    function render() {
	    requestAnimationFrame( render );


        renderer.render( scene, camera );
    }
    render();

}
