var container, scene, renderer, camera, light, clock, loader;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;


var plane;

container = document.body;

clock = new THREE.Clock();

WIDTH = window.innerWidth,
HEIGHT = window.innerHeight;

VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = 1,
FAR = 10000;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMapAutoUpdate = true;
renderer.setClearColor(0xffffff, 1);

container.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

camera.position.set(0, 300, 500);
camera.rotation.x = -Math.PI / 6;

scene.add(camera);


var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener( 'change', render );

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
});



var planeGeo = new THREE.PlaneGeometry( 100000, 100000, 1, 1 );
var floorTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/tiles.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 1000, 1000 );
var planeMat = new THREE.MeshPhongMaterial( {map: floorTexture, side: THREE.DoubleSide});
plane = new THREE.Mesh( planeGeo, planeMat);
plane.rotation.x += Math.PI/2
plane.receiveShadow = true;
scene.add(plane);

var ballGeo = new THREE.SphereGeometry( 25, 32, 32 );
var ballTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/baseball.jpg' );
var ballMat = new THREE.MeshLambertMaterial( {map: ballTexture} );
var baseball = new THREE.Mesh( ballGeo, ballMat );
baseball.position.y += 50;
baseball.castShadow = true;
scene.add( baseball );


loader = new THREE.JSONLoader();
var baseballBat;
var batTexture = new THREE.ImageUtils.loadTexture( 'resources/textures/woodBat.jpg' );
loader.load("/resources/jsModels/baseball_bat.json", function (geometry, materials) {
  var material = new THREE.MeshLambertMaterial({
    map: batTexture
  });

  baseballBat = new THREE.Mesh(
    geometry,
    material
  );

  baseballBat.scale.x *= 100;
  baseballBat.scale.y *= 100;
  baseballBat.scale.z *= 100;

  baseballBat.position.y -= 50;
  baseballBat.position.x -= 100;

  baseballBat.castShadow = true;

  scene.add(baseballBat);
});

render();

function render() {
 var time = clock.getElapsedTime();

 renderer.render(scene, camera);
 requestAnimationFrame(render);
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
}

animate();