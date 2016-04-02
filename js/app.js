/*global Physijs THREE keyboardJS dat*/

var container, scene, renderer, camera, light, clock, loader, camControls;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

var baseballBat, baseball, plane;

var armBase, armFirstPortion, armFirstJoint, armSecondPortion, armSecondJoint, armThirdPortion, armThirdJoint, handBase;
var armControl;

var gui;

var cameraInitx, cameraInity, cameraInitz, cameraInitRoty;
cameraInitx = 20;
cameraInity = 10;
cameraInitz = 20;
cameraInitRoty =  Math.PI/4;

Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';


init();
animate();

function buildArm() {
	var armBaseGeo = new THREE.SphereGeometry( 1, 32, 32);
	var armBaseMat = new THREE.MeshLambertMaterial( {color: 0x00ff00
	} );
	armBase = new THREE.Mesh(armBaseGeo, armBaseMat);
	armBase.castShadow = true;
	scene.add(armBase);
	
	var armPortionGeo = new THREE.CylinderGeometry( .5, .5, 6, 32 );
	var armPortionMat = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
	armFirstPortion = new THREE.Mesh(armPortionGeo, armPortionMat);
	armFirstPortion.position.y += 4;
	armFirstPortion.castShadow = true;
	armBase.add(armFirstPortion);

	var armJointGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
	var armJointMat = new THREE.MeshLambertMaterial( {color: 0xff0000});
	armFirstJoint = new THREE.Mesh(armJointGeo, armJointMat);
	armFirstJoint.position.y = 7.6;
	armFirstJoint.rotation.x = Math.PI/2;
	armFirstJoint.castShadow = true;
	armBase.add(armFirstJoint);
	
	armSecondPortion = new THREE.Mesh(armPortionGeo, armPortionMat);
	armSecondPortion.rotation.x = Math.PI/2;
	armSecondPortion.position.z = -3.6;
	armSecondPortion.castShadow = true;
	armFirstJoint.add(armSecondPortion);
	
	armSecondJoint = new THREE.Mesh(armJointGeo, armJointMat);
	armSecondJoint.position.z = -7.2;
	armSecondJoint.castShadow = true;
	armFirstJoint.add(armSecondJoint);
	
	armThirdPortion = new THREE.Mesh(armPortionGeo, armPortionMat);
	armThirdPortion.position.z = -3.6;
	armThirdPortion.rotation.x = Math.PI/2;
	armThirdPortion.castShadow = true;
	armSecondJoint.add(armThirdPortion);
	
	var handBaseGeo = new THREE.SphereGeometry( 0.6, 32, 32);
	var handBaseMat = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
	handBase = new THREE.Mesh(armBaseGeo, armBaseMat);
	armBase.castShadow = true;
	handBase.castShadow = true;
	handBase.position.z = -7.2;
	armSecondJoint.add(handBase);


}

function init() {
	var armControls = function() {
	//this.baseRotX = 0.01;
	this.baseRotY = 0.01;
	this.baseRotZ = 0.01;
	this.FirstJointRot = 0.01;
	this.SecondJointRot = 0.01;
	
	this.reset = function() {
		//this.baseRotX = 0;
		this.baseRotZ = 0;
		this.baseRotY = 0;
		this.FirstJointRot = Math.PI/3;
		this.SecondJointRot = Math.PI/3;
	}
}
	armControl = new armControls();
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
	
	camera.position.set(cameraInitx, cameraInity, cameraInitz);
	camera.rotation.y = cameraInitRoty;
	
	scene.add(camera);
	
	keyboardJS.bind('space', function() {
		camera.position.set(cameraInitx, cameraInity, cameraInitz);
		camera.rotation.y = cameraInitRoty;
	} );
	
	gui = new dat.GUI();
	var baseRot = gui.addFolder("Rotation of base");
	baseRot.open();
	//baseRot.add(armControl, 'baseRotX', -Math.PI/2, Math.PI/2).step(.01).listen();
	baseRot.add(armControl, 'baseRotY', -Math.PI, Math.PI).step(.01).listen();
	baseRot.add(armControl, 'baseRotZ', -Math.PI/2, Math.PI/2).step(.01).listen();
	gui.add(armControl, 'FirstJointRot', -5*Math.PI/6, 5*Math.PI/6).step(.01).listen();
	gui.add(armControl, 'SecondJointRot', -5*Math.PI/6, 5*Math.PI/6).step(.01).listen();
	gui.add(armControl, 'reset');
	armControl.reset();
/*
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
*/

	camControls = new THREE.OrbitControls( camera );
  	camControls.addEventListener( 'change', render );
  	
	light = new THREE.DirectionalLight(0xffffff);
	
	light.position.set(100, 100, 100);
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

/*
	var ballGeo = new THREE.SphereGeometry( 1, 32, 32 );
	var ballTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/baseball.jpg' );
	var ballMat = new THREE.MeshLambertMaterial( {map: ballTexture} );
	baseball = new Physijs.SphereMesh( ballGeo, ballMat, 5, {restitution: 0.5} );
	baseball.position.y += 5;
	baseball.castShadow = true;
	baseball.receiveShadow = true;
	scene.add( baseball );
*/	
	
	buildArm();
	
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
	renderer.render(scene, camera);
}

function animate() {
	update();
	scene.simulate();
	var delta = clock.getDelta();
	camControls.update();
	requestAnimationFrame(animate);
	
	renderer.render(scene, camera);
	
}

function update(){
	//armBase.rotation.x = armControl.baseRotX;
	armBase.rotation.y = armControl.baseRotY;
	armBase.rotation.z = armControl.baseRotZ;
	armFirstJoint.rotation.y = -armControl.FirstJointRot;
	armSecondJoint.rotation.y = -armControl.SecondJointRot;
}