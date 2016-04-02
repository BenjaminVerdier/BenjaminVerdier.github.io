/*global Physijs THREE keyboardJS dat*/

var container, scene, renderer, camera, light, clock, loader, camControls;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

var baseballBat, baseball, plane;

var armBase, armBaseBis, armFirstPortion, armFirstJoint, armSecondPortion, armSecondJoint, armThirdPortion, handBase, finger1, finger2, finger3,
	fingerAttach1, fingerAttach2, fingerAttach3;
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
	armBase = new Physijs.SphereMesh(armBaseGeo, armBaseMat, 1);
	armBase.castShadow = true;
	armBase.position.y += 1;
	
	
	
	var armPortionGeo = new THREE.CylinderGeometry( .5, .5, 6, 32 );
	var armPortionMat = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
	armFirstPortion = new Physijs.CylinderMesh(armPortionGeo, armPortionMat, 1);
	armFirstPortion.position.y += 5;
	armFirstPortion.castShadow = true;

	var armJointGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
	var armJointMat = new THREE.MeshLambertMaterial( {color: 0xff0000});
	armFirstJoint = new Physijs.CylinderMesh(armJointGeo, armJointMat);
	armFirstJoint.position.y = 7.6;
	armFirstJoint.rotation.x = Math.PI/2;
	armFirstJoint.castShadow = true;
	
	armSecondPortion = new Physijs.CylinderMesh(armPortionGeo, armPortionMat);
	//armSecondPortion.rotation.z = Math.PI/2;
	armSecondPortion.position.y = 12.2;
	armSecondPortion.castShadow = true;
	
	armSecondJoint = new Physijs.CylinderMesh(armJointGeo, armJointMat);
	armSecondJoint.position.y = 17;
	armSecondJoint.castShadow = true;
	
	armThirdPortion = new Physijs.CylinderMesh(armPortionGeo, armPortionMat);
	armThirdPortion.position.y = 23;
	armThirdPortion.rotation.x = Math.PI/2;
	armThirdPortion.castShadow = true;
	
	var handBaseGeo = new THREE.SphereGeometry( 0.6, 32, 32);
	var handBaseMat = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
	handBase = new Physijs.SphereMesh(handBaseGeo, handBaseMat);
	armBase.castShadow = true;
	handBase.castShadow = true;
	handBase.position.z = -7.2;
	
	fingerAttach1 = new Physijs.BoxMesh(new THREE.BoxGeometry( 0.001, 0.001, 0.001 ), new THREE.MeshBasicMaterial({color:0x000000}), 0);
	fingerAttach2 = new Physijs.BoxMesh(new THREE.BoxGeometry( 0.001, 0.001, 0.001 ), new THREE.MeshBasicMaterial({color:0x000000}), 0);
	fingerAttach3 = new Physijs.BoxMesh(new THREE.BoxGeometry( 0.001, 0.001, 0.001 ), new THREE.MeshBasicMaterial({color:0x000000}), 0);
	
	loader = new THREE.JSONLoader();
	loader.load("/resources/jsModels/finger.json", function (fingerGeo, materials) {
	  var fingerMat = new THREE.MeshLambertMaterial({
	    color: 0xaaaaaa
	  });

	  finger1 = new Physijs.ConcaveMesh(
	    fingerGeo,
	    fingerMat,
	    5, {restitution: 0.5}
	  );
	  finger1.castShadow = true;
	  finger1.scale.x *= 2;
	  finger1.scale.y *= 2;
	  finger1.scale.z *= 2;
	  finger1.position.x = 0.6;
	  finger1.rotation.x = Math.PI/2;
	  fingerAttach1.add(finger1);
	  
	  finger2 = new Physijs.ConcaveMesh(
	    fingerGeo,
	    fingerMat,
	    5, {restitution: 0.5}
	  );
	  finger2.castShadow = true;
	  finger2.scale.x *= 2;
	  finger2.scale.y *= 2;
	  finger2.scale.z *= 2;
	  finger2.position.x = 0.6;
	  finger2.rotation.x = Math.PI/2;
	  fingerAttach2.rotation.z += 2*Math.PI/3;
	  fingerAttach2.add(finger2);
	  
	  finger3 = new Physijs.ConcaveMesh(
	    fingerGeo,
	    fingerMat,
	    5, {restitution: 0.5}
	  );
	  finger3.castShadow = true;
	  finger3.scale.x *= 2;
	  finger3.scale.y *= 2;
	  finger3.scale.z *= 2;
	  finger3.position.x = 0.6;
	  finger3.rotation.x = Math.PI/2;
	  fingerAttach3.rotation.z -= 2*Math.PI/3;
	  fingerAttach3.add(finger3);
		
	})
	
	
//	scene.add(fingerAttach1);
//	scene.add(fingerAttach2);
//	scene.add(fingerAttach3);
//	scene.add(handBase);
//	scene.add(armThirdPortion);
//	scene.add(armSecondJoint);
//	scene.add(armSecondPortion);
	armFirstPortion.add(armFirstJoint);
	scene.add(armFirstPortion);
	//scene.add(armFirstPortion);
	scene.add(armBase);
	/*
	var fingerMat = new THREE.MeshLambertMaterial({
	    color: 0xaaaaaa
	  });
	var fingerPortionGeo = new THREE.CylinderGeometry(0.15,0.15,1, 32);
	var fingerJointGeo = new THREE.SphereGeometry(0.5, 32, 32);
	
	var finger1FirstPortion = new Physijs.CylinderMesh(fingerPortionGeo, fingerMat, 5, {restitution: 0.5});
	//finger1FirstPortion.position.x = 1.1;
	//finger1FirstPortion.rotation.z = Math.PI/2;
	//ingerAttach1.add(finger1FirstPortion);
	finger1FirstPortion.position.x += 10;
	finger1FirstPortion.position.z -= 1;
	finger1FirstPortion.position.y += 5;
	var finger1FirstJoint = new THREE.Mesh(fingerJointGeo, fingerMat);
	plane.add(finger1FirstPortion);*/
	
	
	
}

function keyBindings(){
	keyboardJS.bind("a", function(e){
		armBase.setAngularVelocity(new THREE.Vector3(0,0,1));
	},function(e) {
		armBase.setAngularVelocity(new THREE.Vector3(0,0,0));
		armBase.setLinearVelocity(new THREE.Vector3(0,0,0));
	});
	keyboardJS.bind("z", function(e){
		armBase.setAngularVelocity(new THREE.Vector3(0,0,-1));
	},function(e) {
		armBase.setAngularVelocity(new THREE.Vector3(0,0,0));
		armBase.setLinearVelocity(new THREE.Vector3(0,0,0));
	});
	keyboardJS.bind("e", function(e){
		armFirstPortion.setAngularVelocity(new THREE.Vector3(0,1,0));
	},function(e) {
		armFirstPortion.setAngularVelocity(new THREE.Vector3(0,0,0));
		armFirstPortion.setLinearVelocity(new THREE.Vector3(0,0,0));
	});
	keyboardJS.bind("r", function(e){
		armFirstPortion.setAngularVelocity(new THREE.Vector3(0,0,-1));
	},function(e) {
		armFirstPortion.setAngularVelocity(new THREE.Vector3(0,0,0));
		armFirstPortion.setLinearVelocity(new THREE.Vector3(0,0,0));
	});
}

function setConstraints() {
	
	armBase.constraintGlobal = new Physijs.DOFConstraint(armBase, new THREE.Vector3(0,1,0));
	scene.addConstraint(armBase.constraintGlobal);
	armBase.constraintGlobal.setAngularLowerLimit(new THREE.Vector3(0, -Math.PI, -Math.PI));
	armBase.constraintGlobal.setAngularUpperLimit(new THREE.Vector3(0, Math.PI, Math.PI));
	
	armBase.constraintPortion = new Physijs.PointConstraint(armBase, armFirstPortion, new THREE.Vector3(0,2,0));
	scene.addConstraint(armBase.constraintPortion);
	/*
	armBase.constraintz = new Physijs.HingeConstraint(armBase, new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1));
	scene.addConstraint(armBase.constraintz);
	
	/*
	armFirstPortion.constraintGlobal = new Physijs.DOFConstraint(armFirstPortion, new THREE.Vector3(0,2,0));
	scene.addConstraint(armFirstPortion.constraintGlobal);
	armFirstPortion.constraintGlobal.setLinearLowerLimit(0, 0, 0);
	armFirstPortion.constraintGlobal.setLinearUpperLimit(0, 0,0);
	armFirstPortion.constraintGlobal.setAngularLowerLimit(0, 0, 0);
	armFirstPortion.constraintGlobal.setAngularUpperLimit(0, 0,0);
	/*
	armFirstJoint.constraintGlobal = new Physijs.DOFConstraint(armFirstJoint, armFirstPortion, new THREE.Vector3(0,8,0));
	scene.addConstraint(armFirstJoint.constraintGlobal);
	armFirstJoint.constraintGlobal.setLinearLowerLimit(0, 0, 0);
	armFirstJoint.constraintGlobal.setLinearUpperLimit(0, 0,0);
	armFirstJoint.constraintGlobal.setAngularLowerLimit(0, 0, 0);
	armFirstJoint.constraintGlobal.setAngularUpperLimit(0, 0,0);
	
	armSecondPortion.constraintGlobal = new Physijs.DOFConstraint(armFirstJoint, armSecondPortion, new THREE.Vector3(0,9.2,0));
	scene.addConstraint(armSecondPortion.constraintGlobal);
	armSecondPortion.constraintGlobal.setLinearLowerLimit(0, 0, 0);
	armSecondPortion.constraintGlobal.setLinearUpperLimit(0, 0,0);
	armSecondPortion.constraintGlobal.setAngularLowerLimit(0, 0, 0);
	armSecondPortion.constraintGlobal.setAngularUpperLimit(0, 0,0);
	
	armSecondJoint.constraintGlobal = new Physijs.DOFConstraint(armSecondJoint, armSecondPortion, new THREE.Vector3(0,15.2,0));
	scene.addConstraint(armSecondJoint.constraintGlobal);
	armSecondJoint.constraintGlobal.setLinearLowerLimit(0, 0, 0);
	armSecondJoint.constraintGlobal.setLinearUpperLimit(0, 0,0);
	armSecondJoint.constraintGlobal.setAngularLowerLimit(0, 0, 0);
	armSecondJoint.constraintGlobal.setAngularUpperLimit(0, 0,0);
	
	armThirdPortion.constraintGlobal = new Physijs.DOFConstraint(armSecondJoint, armThirdPortion, new THREE.Vector3(0,15.8,0));
	scene.addConstraint(armThirdPortion.constraintGlobal);
	armThirdPortion.constraintGlobal.setLinearLowerLimit(0, 0, 0);
	armThirdPortion.constraintGlobal.setLinearUpperLimit(0, 0,0);
	armThirdPortion.constraintGlobal.setAngularLowerLimit(0, 0, 0);
	armThirdPortion.constraintGlobal.setAngularUpperLimit(0, 0,0);
	
	handBase.constraintGlobal = new Physijs.DOFConstraint(handBase, armThirdPortion, new THREE.Vector3(0,21.8,0));
	scene.addConstraint(handBase.constraintGlobal);
	handBase.constraintGlobal.setLinearLowerLimit(0, 0, 0);
	handBase.constraintGlobal.setLinearUpperLimit(0, 0,0);
	handBase.constraintGlobal.setAngularLowerLimit(0, 0, 0);
	handBase.constraintGlobal.setAngularUpperLimit(0, 0,0);
	*/
}

function init() {
	var armControls = function() {
	//this.baseRotX = 0.01;
	this.baseRotY = -0.37;
	this.baseRotZ = -0.18;
	this.FirstJointRot = 1.07;
	this.SecondJointRot = 1.81;
	
	this.reset = function() {
		//this.baseRotX = 0;
		this.baseRotY = 0.;
		this.baseRotZ = 0.;
		this.FirstJointRot = 0;//Math.PI/3;
		this.SecondJointRot = 0;//Math.PI/3;
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

	//var floorTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/tiles.jpg' );
//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
//	floorTexture.repeat.set( 100, 100 );

	var planeMat = new Physijs.createMaterial(
		new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide}),
		.8,	// Friction
		1. ); //Restitution

	plane = new Physijs.BoxMesh( planeGeo, planeMat, 0 /*mass*/);
	plane.rotation.x += Math.PI/2;
	//plane.rotation.x += 0.2;
	plane.receiveShadow = true;
	scene.add(plane);

/*
	var ballGeo = new THREE.SphereGeometry( 1, 32, 32 );
	var ballTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/baseball.jpg' );
	var ballMat = new THREE.MeshLambertMaterial( {map: ballTexture} );
	baseball = new Physijs.SphereMesh( ballGeo, ballMat, 5 );
	baseball.position.y += 30;
	//baseball.position.x += 0.2;
	baseball.castShadow = true;
	baseball.receiveShadow = true;
	scene.add( baseball );
*/
	
	buildArm();
	scene.add(plane);
	
	setConstraints();
	keyBindings();
	
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
	/*
	armBase.rotation.set(0, armControl.baseRotY, armControl.baseRotZ);
	armBase.rotation.z = armControl.baseRotZ;
	armFirstJoint.rotation.y = -armControl.FirstJointRot;
	armSecondJoint.rotation.y = -armControl.SecondJointRot;
	*/
	
}