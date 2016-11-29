class Terrain {
    constructor(detail, width, height) {
        this.width = width;
        this.height = height;
        this.size = Math.pow(2, detail) + 1;
        this.max = this.size - 1;
        this.mesh = new Float32Array(this.size * this.size);
    }

    getVal(x, y) {
        if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
        return this.mesh[x + this.size * y];
    }

    setVal(x, y, val) {
        this.mesh[x + this.size * y] = val;
    }

    generate(roughness) {
        var self = this;
        this.setVal(0, 0, Math.random() * 3);
        this.setVal(this.max, 0, Math.random() * 3);
        this.setVal(this.max, this.max, Math.random() * 3);
        this.setVal(0, this.max, Math.random() * 3);
        divide(this.max);
        function divide(size) {
          var x, y, half = size / 2;
          var scale = roughness * size;
          if (half < 1) return;
          for (y = half; y < self.max; y += size) {
            for (x = half; x < self.max; x += size) {
              square(x, y, half, Math.random() * scale * 2 - scale);
            }
          }
          for (y = 0; y <= self.max; y += half) {
            for (x = (y + half) % size; x <= self.max; x += size) {
              diamond(x, y, half, Math.random() * scale * 2 - scale);
            }
          }
          divide(size / 2);
        }
        function average(values) {
          var valid = values.filter(function(val) { return val !== -1; });
          var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
          return total / valid.length;
        }
        function square(x, y, size, offset) {
          var ave = average([
            self.getVal(x - size, y - size),   // upper left
            self.getVal(x + size, y - size),   // upper right
            self.getVal(x + size, y + size),   // lower right
            self.getVal(x - size, y + size)    // lower left
          ]);
          self.setVal(x, y, ave + offset);
        }
        function diamond(x, y, size, offset) {
          var ave = average([
            self.getVal(x, y - size),      // top
            self.getVal(x + size, y),      // right
            self.getVal(x, y + size),      // bottom
            self.getVal(x - size, y)       // left
          ]);
          self.setVal(x, y, ave + offset);
        }
    }

    toGeometry() {
        // create a geometry out of the heightmap
        var geometry = new THREE.PlaneBufferGeometry( this.width, this.height, this.size - 1, this.size - 1);
        var verts = geometry.attributes.position.array;
        for ( var i = 0, z = 2, l = verts.length; i < l; i ++, z += 3 ) { // indenting by 3 because format is x,y,z,x,y,z....
    		verts[ z ] = this.mesh[ i ];
    	}
        return geometry;
    }

    toTexture() {
        // Generate random white noise texture
        var noiseSize = 1024;
        var size = noiseSize * noiseSize;
        var data = new Uint8Array( 4 * size );
        for ( var i = 0; i < size; i ++ ) {
            var color = Math.random() * 255
            data[ i * 4 ] = color;
            data[ i * 4 + 1] = color;
            data[ i * 4 + 2] = color;
            data[ i * 4 + 3] = 255
        }
        var dt = new THREE.DataTexture( data, noiseSize, noiseSize, THREE.RGBAFormat );
        dt.wrapS = THREE.RepeatWrapping;
        dt.wrapT = THREE.RepeatWrapping;
        dt.needsUpdate = true;
        return dt;
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

    // creates a terrain object with a complexity of 10000 points and a width/height of 15 and noise of 0.004
    var level = 10
    terrain = new Terrain(level, 15, 15);
    terrain.generate(0.004);

    // get the components that comprise our terrain
    // var texture = terrain.toTexture();
    var geometry = terrain.toGeometry();

    // add attributes to color the terrain
    var verts = geometry.attributes.position.array;
    var heights = new Float32Array(Math.floor(verts.length/3));
    for(var i = 2; i < verts.length; i += 3) {
        heights[Math.floor(i/3)] = (verts[i] + 1) / 5;
    }
    geometry.addAttribute('height', new THREE.BufferAttribute(heights, 1));

    // create a material for the mesh
    vertex_shader = "attribute float height; varying lowp vec4 vColor; void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); vColor = vec4(-(height * height * 9.0) + 1.0, -((height - 0.5) * (height - 0.5) * 9.0) + 1.0, -((height - 1.0) * (height - 1.0) * 9.0) + 1.0, 0.1); }";
    fragment_shader = "varying lowp vec4 vColor; void main() { gl_FragColor = vColor; }";
    var material = new THREE.ShaderMaterial( {
        vertexShader : vertex_shader,
        fragmentShader : fragment_shader,
    } );

    // create a renderable from our shaders
    var terrain = new THREE.Mesh( geometry, material );

    // tilt back by 1 radian
    terrain.rotateX(-1)
    scene.add( terrain );

    // create a light to see by
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set( 50, 20, 5 );
    scene.add(pointLight);

    // raise camera above plane
    camera.position.z = 25;

    function render() {
	    requestAnimationFrame( render );
        renderer.render( scene, camera );
        terrain.rotation.z += 0.004;
    }
    render();

}
