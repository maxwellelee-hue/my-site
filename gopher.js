import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('gopher-canvas');
if (canvas) {
  // ── SCENE ──────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.55, 3.6);
  camera.lookAt(0, 0.15, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // ── LIGHTS ─────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffeedd, 0.6));

  const key = new THREE.DirectionalLight(0xfff5e8, 1.1);
  key.position.set(2.5, 4, 3.5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xb8d8a0, 0.30);
  fill.position.set(-3, 1, 2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.18);
  rim.position.set(0, 2, -3);
  scene.add(rim);

  // ── LOAD MODEL ─────────────────────────────────────────────────────────
  let gopherModel = null;

  const loader = new GLTFLoader();
  loader.load(
    'go_gopher.glb',
    function (gltf) {
      gopherModel = gltf.scene;

      // Centre and scale to fit
      const box    = new THREE.Box3().setFromObject(gopherModel);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const scale  = 2.0 / Math.max(size.x, size.y, size.z);

      gopherModel.scale.setScalar(scale);
      gopherModel.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );

      scene.add(gopherModel);
    },
    undefined,
    function (err) {
      console.error('Failed to load go_gopher.glb:', err);
    }
  );

  // ── ANIMATION ──────────────────────────────────────────────────────────
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.009;
    if (gopherModel) {
      gopherModel.rotation.y = t * 0.38;
      gopherModel.position.y = Math.sin(t * 0.85) * 0.042;
    }
    renderer.render(scene, camera);
  }
  animate();

  // ── RESIZE ─────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
}
