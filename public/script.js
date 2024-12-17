// public/script.js
const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Connect to the server via the API route
const socket = io();

let playerMesh;
let currentGun;

// Load a skin and map dynamically
function loadSkin(skinUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(skinUrl, (texture) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        playerMesh = new THREE.Mesh(geometry, material);
        scene.add(playerMesh);
        playerMesh.position.set(0, 1, 0);
        console.log(`Loaded skin from ${skinUrl}`);
    });
}

function loadGun(gunName) {
    const loader = new THREE.GLTFLoader();
    loader.load(`assets/guns/${gunName}`, (gltf) => {
        currentGun = gltf.scene;
        currentGun.position.set(0, 1, -1);
        playerMesh.add(currentGun);
        console.log(`Loaded gun: ${gunName}`);
    });
}

function initializePlayer() {
    socket.emit('requestRandomSkin');
    socket.emit('requestRandomMap');
}

socket.on('skinSelected', (skinUrl) => {
    loadSkin(`assets/skins/${skinUrl}`);
});

socket.on('mapSelected', (mapUrl) => {
    const loader = new THREE.GLTFLoader();
    loader.load(`assets/maps/${mapUrl}`, (gltf) => {
        scene.add(gltf.scene);
        console.log(`Loaded map: ${mapUrl}`);
    });
});

socket.on('connect', initializePlayer);

function movePlayer(playerId, data) {
    // Update player position based on received data
}

// Handle player movement
socket.on('playerMove', (data) => {
    movePlayer(data.playerId, data);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
