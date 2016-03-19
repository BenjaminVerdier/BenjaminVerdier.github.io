var container, scene, renderer, camera, light, clock, loader, camControls;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

var baseballBat, baseball, plane;

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

	scene = new THREE.Scene();

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
    camControls.lookVertical = true;
    //camControls.constrainVertical = true;
    //camControls.verticalMin = 1.0;
    //camControls.verticalMax = 2.0;
    camControls.lon = -150;
    camControls.lat = 120;

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
	var planeMat = new THREE.MeshPhongMaterial( {map: floorTexture, side: THREE.DoubleSide});
	plane = new THREE.Mesh( planeGeo, planeMat);
	plane.rotation.x += Math.PI/2
	plane.receiveShadow = true;
	scene.add(plane);

	var ballGeo = new THREE.SphereGeometry( 1, 32, 32 );
	var ballTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/baseball.jpg' );
	var ballMat = new THREE.MeshLambertMaterial( {map: ballTexture} );
	baseball = new THREE.Mesh( ballGeo, ballMat );
	baseball.position.y += 5;
	baseball.castShadow = true;
	scene.add( baseball );


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
	var delta = clock.getDelta();
	camControls.update(delta);
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}