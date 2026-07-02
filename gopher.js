import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('gopher-canvas');
if (canvas) {
  // ── SCENE ──────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.55, 2.6);
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

      const box    = new THREE.Box3().setFromObject(gopherModel);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const scale  = 3.0 / Math.max(size.x, size.y, size.z);

      gopherModel.scale.setScalar(scale);
      gopherModel.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );

      scene.add(gopherModel);
    },
    undefined,
    function (err) { console.error('Failed to load go_gopher.glb:', err); }
  );

  // ── DRAG-TO-ROTATE STATE ───────────────────────────────────────────────
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let dragRotY = 0;   // accumulated horizontal drag offset
  let dragRotX = 0;   // accumulated vertical drag offset (springs back)

  function startDrag(x, y) {
    isDragging = true;
    lastX = x; lastY = y;
    canvas.style.cursor = 'grabbing';
  }

  function moveDrag(x, y) {
    if (!isDragging) return;
    const dx = x - lastX;
    const dy = y - lastY;
    lastX = x; lastY = y;
    dragRotY += dx * 0.012;
    dragRotX = Math.max(-0.75, Math.min(0.75, dragRotX + dy * 0.012));
  }

  function endDrag() {
    isDragging = false;
    canvas.style.cursor = 'grab';
  }

  // Mouse
  canvas.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', endDrag);

  // Touch
  canvas.addEventListener('touchstart', e => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (isDragging) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchend', endDrag);

  canvas.style.cursor = 'grab';

  // ── ANIMATION ──────────────────────────────────────────────────────────
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.009;

    if (gopherModel) {
      // Auto-rotate Y continuously; dragRotY adds the user's spin on top
      gopherModel.rotation.y = t * 0.38 + dragRotY;

      // X tilt from drag — spring back to upright when not dragging
      if (!isDragging) dragRotX *= 0.92;
      gopherModel.rotation.x = dragRotX;

      // Bob up/down (paused while dragging so it feels "held")
      if (!isDragging) gopherModel.position.y = Math.sin(t * 0.85) * 0.055;
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
