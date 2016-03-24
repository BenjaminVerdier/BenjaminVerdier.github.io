var container, scene, renderer, camera, light, clock, loader, camControls;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

var baseballBat, baseball, plane;

Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var keyboard = new THREEx.KeyboardState();

init();
animate();


function init() {
	container = document.body;

	clock = new THREE.Clock();

	WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

	VIEW_ANGLE = 60,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 1,
	FAR = 100;

	scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
    scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
    scene.addEventListener(
        'update',
        function() {
            scene.simulate( undefined, 2 );
        });

	//scene = new THREE.Scene();

	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.shadowMapAutoUpdate = true;
	renderer.setClearColor(scene.fog.color);

	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	camera.position.set(49, 10, 49);
	camera.rotation.y = Math.PI/4;

	scene.add(camera);

	camControls = new THREE.FirstPersonControls(camera);
    camControls.lookSpeed = 0.1;
    camControls.movementSpeed = 20;
    camControls.noFly = true;
    //camControls.lookVertical = true;
    //camControls.constrainVertical = true;
    //camControls.verticalMin = 1.0;
    //camControls.verticalMax = 2.0;
    camControls.lon = -135;
    //camControls.lat = 120;
    camControls.enabled = false;

	light = new THREE.DirectionalLight(0xffffff);

	light.position.set(0, 100, 0);
	light.castShadow = true;
	light.shadow.camera.left = -60;
	light.shadow.camera.top = -60;
	light.shadow.camera.right = 60;
	light.shadow.camera.bottom = 60;
	light.shadow.camera.near = 1;
	light.shadow.camera.far = 1000;
	light.shadow.bias = -.0001
	light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
	light.shadowDarkness = .7;


	scene.add(light);

	window.addEventListener('resize', function() {
	  var WIDTH = window.innerWidth,
	      HEIGHT = window.innerHeight;
	  renderer.setSize(WIDTH, HEIGHT);
	  camera.aspect = WIDTH / HEIGHT;
	  camera.updateProjectionMatrix();
	  camControls.handleResize();
	  render();
	});



	var planeGeo = new THREE.PlaneGeometry( 100, 100, 1, 1 );

	var floorTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/tiles.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 100, 100 );

	var planeMat = new Physijs.createMaterial(
		new THREE.MeshLambertMaterial( {map: floorTexture, side: THREE.DoubleSide}),
		.8,	// Friction
		1. ); //Restitution

	plane = new Physijs.BoxMesh( planeGeo, planeMat, 0 /*mass*/);
	plane.rotation.x += Math.PI/2
	plane.receiveShadow = true;
	scene.add(plane);

	var ballGeo = new THREE.SphereGeometry( 1, 32, 32 );
	var ballTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/baseball.jpg' );
	var ballMat = new THREE.MeshLambertMaterial( {map: ballTexture} );
	baseball = new Physijs.SphereMesh( ballGeo, ballMat, 5, {restitution: 0.5} );
	baseball.position.y += 5;
	baseball.castShadow = true;
	baseball.receiveShadow = true;
	scene.add( baseball );

/*
	loader = new THREE.JSONLoader();
	var batTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/woodBat.jpg' );
	loader.load("/resources/jsModels/baseball_bat.json", function (geometry, materials) {
	  var material = new THREE.MeshLambertMaterial({
	    map: batTexture
	  });

	  baseballBat = new THREE.Mesh(
	    geometry,
	    material
	  );

	  baseballBat.scale.x *= 3;
	  baseballBat.scale.y *= 3;
	  baseballBat.scale.z *= 3;

	  baseballBat.position.y += 5;
	  baseballBat.position.x -= 10;

	  baseballBat.castShadow = true;

	  scene.add(baseballBat);
	});

*/
	render();
}
function render() {
	var delta = clock.getDelta();
	camControls.update(delta);
	renderer.clear();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function animate() {
	update();
	scene.simulate();
	var delta = clock.getDelta();
	camControls.update(delta);
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function update(){

    }