const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set the camera position to see objects in the scene
camera.position.set(0, 2, 5); // Adjust camera Y and Z values to change view

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Connect to the server via the API route
const socket = io();

let playerMesh;

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

function loadSkin(skinUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(skinUrl, (texture) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        playerMesh = new THREE.Mesh(geometry, material);
        scene.add(playerMesh);
        playerMesh.position.set(0, 1, 0);
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
    });
});

socket.on('connect', () => {
    initializePlayer();
    document.getElementById('lobby').style.display = 'none'; // Hide lobby
    document.getElementById('gameCanvas').style.display = 'block'; // Show game canvas
});

// Movement controls for player (WASD)
window.addEventListener('keydown', (event) => {
    const keyMap = {
        KeyW: { x: 0, z: -0.1 },
        KeyS: { x: 0, z: 0.1 },
        KeyA: { x: -0.1, z: 0 },
        KeyD: { x: 0.1, z: 0 },
    };
    
    if (keyMap[event.code] && playerMesh) {
        playerMesh.position.x += keyMap[event.code].x;
        playerMesh.position.z += keyMap[event.code].z;

        socket.emit('playerMove', { position: playerMesh.position });
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('lobby').style.display = 'none'; // Hide lobby
    document.getElementById('gameCanvas').style.display = 'block'; // Show game canvas
    initializePlayer(); // Initialize the player
    animate(); // Start the game loop
});
