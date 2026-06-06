import * as THREE from 'https://esm.sh/three@0.160.0';
import { STLLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

export function initSTLViewer(container) {
    const url = container.getAttribute("data-src");
    if (!url) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(container.getAttribute("data-bg-color") || "#eeeeee");

    const camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);
    camera.position.set(3, 3, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new STLLoader();
    loader.load(url, (geometry) => {
        const material = new THREE.MeshPhongMaterial({
            color: container.getAttribute("data-model-color") || "#888888",
            specular: 0x111111,
            shininess: 200
        });
        const mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        mesh.position.sub(center);

        scene.add(mesh);

        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim / (2 * Math.tan(Math.PI * camera.fov / 360));
        camera.position.set(distance * 1.5, distance * 1.5, distance * 1.5);
        camera.updateProjectionMatrix();

        controls.target.set(0, 0, 0);
        controls.update();
    }, undefined, (error) => {
        console.error('An error happened', error);
        container.innerHTML = '<p style="color:red; padding: 20px;">Error loading STL file. Check console for details.</p>';
    });

    scene.add(new THREE.HemisphereLight(0xffffff, 0x111122));
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(20, 20, 10);
    scene.add(spotLight);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    const resizeObserver = new ResizeObserver(() => {
        if (container.clientWidth === 0 || container.clientHeight === 0) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);
}

// Auto-initialize
function autoInit() {
    document.querySelectorAll(".stl-viewer").forEach(container => {
        if (!container.getAttribute('data-initialized')) {
            initSTLViewer(container);
            container.setAttribute('data-initialized', 'true');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
} else {
    autoInit();
}
