// --- CONFIGURATION ---
const SCENE_CONFIG = {
  zoomSpeed: 0.1,
  cameraZ: 20, // Fixed camera distance, we scale the world instead
};

// --- DATA: THE OBJECTS ---
// exponent: 10^x meters
const OBJECTS = [
  {
    name: "Proton",
    exponent: -15,
    color: 0xff3333,
    desc: "The nucleus of a hydrogen atom. 1 femtometer wide.",
    type: "proton",
  },
  {
    name: "Hydrogen Atom",
    exponent: -10, // 1 Angstrom
    color: 0x3388ff,
    desc: "An electron cloud orbiting a nucleus. Mostly empty space.",
    type: "atom",
  },
  {
    name: "DNA Strand",
    exponent: -8.5,
    color: 0xccff00,
    desc: "The blueprint of life. Width approx 2.5 nanometers.",
    type: "dna",
  },
  {
    name: "Virus (Bacteriophage)",
    exponent: -6.5,
    color: 0xaa00cc,
    desc: "A biological entity roughly 200 nanometers tall.",
    type: "virus",
  },
  {
    name: "Beach Ball",
    exponent: -0.3, // ~0.5 meters
    color: 0xffaa00,
    desc: "A standard 50cm beach ball.",
    type: "ball",
  },
  {
    name: "The Earth",
    exponent: 7.1, // ~12,742 km
    color: 0x2233ff,
    desc: "Our home. 12,742 km in diameter.",
    type: "earth",
  },
  {
    name: "The Sun",
    exponent: 9.1, // ~1.4 million km
    color: 0xffaa00,
    desc: "A G-type main-sequence star. 109 times wider than Earth.",
    type: "sun",
  },
  {
    name: "Solar System",
    exponent: 13,
    color: 0xffffff,
    desc: "The orbit of Neptune.",
    type: "solar_system",
  },
  {
    name: "Milky Way Galaxy",
    exponent: 20.5, // ~100,000 light years
    color: 0xaa88ff,
    desc: "A spiral galaxy containing 100-400 billion stars.",
    type: "galaxy",
  },
  {
    name: "Observable Universe",
    exponent: 26.5,
    color: 0x111122,
    desc: "The cosmic horizon. ~93 billion light-years across.",
    type: "universe",
  },
];

// --- SETUP THREE.JS ---
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02); // Deep space fog

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = SCENE_CONFIG.cameraZ;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 0);
sunLight.position.set(10, 10, 20);
scene.add(sunLight);

// --- GENERATORS (Procedural Assets) ---
// We create a container Group for each object to handle its internal logic

function createProton() {
  const group = new THREE.Group();
  // Core
  const geo = new THREE.SphereGeometry(1, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0x550000,
    roughness: 0.4,
  });
  const sphere = new THREE.Mesh(geo, mat);
  group.add(sphere);

  // Glow
  const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
  });
  group.add(new THREE.Mesh(glowGeo, glowMat));

  // Quarks (implied movement)
  const quarkGeo = new THREE.SphereGeometry(0.2, 16, 16);
  for (let i = 0; i < 3; i++) {
    const q = new THREE.Mesh(
      quarkGeo,
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    q.userData = {
      speed: Math.random() * 2,
      axis: new THREE.Vector3(
        Math.random(),
        Math.random(),
        Math.random()
      ).normalize(),
    };
    q.name = "quark";
    group.add(q);
  }
  return group;
}

function createAtom() {
  const group = new THREE.Group();
  // Nucleus
  const nGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const nucleus = new THREE.Mesh(
    nGeo,
    new THREE.MeshBasicMaterial({ color: 0xff3333 })
  );
  group.add(nucleus);

  // Electron Orbits
  const orbits = new THREE.Group();
  group.add(orbits);

  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.01, 8, 50),
      new THREE.MeshBasicMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.3,
      })
    );
    ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    orbits.add(ring);

    // Electron
    const eGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const elec = new THREE.Mesh(
      eGeo,
      new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    // Just attach to ring for visual simplicity in static logic, animated in render loop
    ring.add(elec);
    elec.position.x = 1;
  }
  return group;
}

function createDNA() {
  const group = new THREE.Group();
  const helixRadius = 0.5;
  const height = 4;
  const turns = 2;
  const steps = 30;

  const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const barGeo = new THREE.CylinderGeometry(0.05, 0.05, helixRadius * 2, 8);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;

    const x1 = Math.cos(angle) * helixRadius;
    const z1 = Math.sin(angle) * helixRadius;

    const atom1 = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    atom1.position.set(x1, y, z1);

    const atom2 = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshLambertMaterial({ color: 0x0000ff })
    );
    atom2.position.set(-x1, y, -z1);

    const bar = new THREE.Mesh(
      barGeo,
      new THREE.MeshLambertMaterial({ color: 0xcccccc })
    );
    bar.position.set(0, y, 0);
    bar.rotation.y = -angle;
    bar.rotation.z = Math.PI / 2;

    group.add(atom1, atom2, bar);
  }
  // Rotate to look nice
  group.rotation.z = Math.PI / 4;
  group.rotation.x = Math.PI / 4;
  return group;
}

function createVirus() {
  const group = new THREE.Group();
  // Icosahedron Head
  const head = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshLambertMaterial({ color: 0xaa00cc, flatShading: true })
  );
  group.add(head);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.05, 0.02, 1.5);
  const legMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
  for (let i = 0; i < 6; i++) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.y = -1;
    leg.rotation.y = (i / 6) * Math.PI * 2;
    leg.rotation.z = Math.PI / 4;
    group.add(leg);
  }
  return group;
}

function createBeachBall() {
  // Create a canvas texture for stripes
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const colors = [
    "#ff0000",
    "#ffffff",
    "#0000ff",
    "#ffffff",
    "#ffff00",
    "#ffffff",
  ];
  const sliceWidth = 512 / 6;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(i * sliceWidth, 0, sliceWidth, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);

  const geo = new THREE.SphereGeometry(1, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.2,
    metalness: 0.1,
  });
  return new THREE.Mesh(geo, mat);
}

function createEarth() {
  const group = new THREE.Group();
  // Ocean/Land (Procedural noise simulation using simple colors)
  const geo = new THREE.SphereGeometry(1, 64, 64);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x1144cc,
    specular: 0x333333,
    shininess: 15,
  });
  const earth = new THREE.Mesh(geo, mat);
  group.add(earth);

  // Clouds (Slightly larger sphere)
  const cGeo = new THREE.SphereGeometry(1.02, 64, 64);
  const cMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });
  // Add some random "clouds" by using a wireframe logic or just transparency
  // For simple code without assets, we keep it semi-transparent white
  const clouds = new THREE.Mesh(cGeo, cMat);
  group.add(clouds);

  return group;
}

function createSun() {
  const geo = new THREE.SphereGeometry(1, 64, 64);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const sun = new THREE.Mesh(geo, mat);

  // Corona glow
  const sGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const sMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
  });
  sun.add(new THREE.Mesh(sGeo, sMat));
  return sun;
}

function createSolarSystem() {
  const group = new THREE.Group();
  // Sun marker
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  group.add(sun);

  // Orbit lines
  const planets = [0.4, 0.7, 1.0, 1.5, 5.2, 9.5]; // Relative dist
  planets.forEach((dist) => {
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(dist, dist + 0.02, 64),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      })
    );
    orbit.rotation.x = Math.PI / 2;
    group.add(orbit);
  });
  return group;
}

function createGalaxy() {
  const group = new THREE.Group();
  // Particle system for spiral arms
  const particles = 10000;
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const colorC = new THREE.Color();

  for (let i = 0; i < particles; i++) {
    // Spiral math
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 5; // Size
    const spiralOffset = angle * 0.5; // Twist

    // 2 arms roughly
    const branch = i % 2 === 0 ? 0 : Math.PI;
    const curve = Math.pow(Math.random(), 2) * 2; // Concentration near center

    const x = Math.cos(angle * 5 + branch) * curve;
    const z = Math.sin(angle * 5 + branch) * curve;
    const y = (Math.random() - 0.5) * 0.2 * (1 - curve / 2); // Flattened

    positions.push(x, y, z);

    // Color: Center yellow, outer blue/purple
    const dist = Math.sqrt(x * x + z * z);
    if (dist < 0.5) colorC.setHex(0xffaa00);
    else colorC.setHex(0xaa88ff);

    colors.push(colorC.r, colorC.g, colorC.b);
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });
  const system = new THREE.Points(geo, mat);
  group.add(system);
  return group;
}

function createUniverse() {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 5000; i++) {
    const r = 2 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.push(x, y, z);
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ size: 0.03, color: 0x5555aa });
  return new THREE.Points(geo, mat);
}

// --- INSTANTIATE OBJECTS ---
const sceneObjects = [];

OBJECTS.forEach((objData) => {
  let mesh;
  switch (objData.type) {
    case "proton":
      mesh = createProton();
      break;
    case "atom":
      mesh = createAtom();
      break;
    case "dna":
      mesh = createDNA();
      break;
    case "virus":
      mesh = createVirus();
      break;
    case "ball":
      mesh = createBeachBall();
      break;
    case "earth":
      mesh = createEarth();
      break;
    case "sun":
      mesh = createSun();
      break;
    case "solar_system":
      mesh = createSolarSystem();
      break;
    case "galaxy":
      mesh = createGalaxy();
      break;
    case "universe":
      mesh = createUniverse();
      break;
    default:
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xff00ff })
      );
  }
  mesh.userData = objData; // Store metadata
  mesh.visible = false; // Start hidden
  scene.add(mesh);
  sceneObjects.push(mesh);
});

// --- STARS BACKGROUND ---
const starsGeo = new THREE.BufferGeometry();
const starsPos = [];
for (let i = 0; i < 2000; i++) {
  starsPos.push(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
}
starsGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starsPos, 3)
);
const stars = new THREE.Points(
  starsGeo,
  new THREE.PointsMaterial({ color: 0x888888, size: 0.5 })
);
scene.add(stars);

// --- UI LOGIC ---
const slider = document.getElementById("scale-slider");
const nameLabel = document.getElementById("object-name");
const scaleLabel = document.getElementById("scale-readout");
const descLabel = document.getElementById("info-text");

// --- RENDER LOOP ---
function animate() {
  requestAnimationFrame(animate);

  const currentExp = parseFloat(slider.value);
  const viewDistance = 15; // How far the "camera" is effectively from the object center in scaled units

  // Find the object closest to current scale
  // We will blend objects.
  // Logic:
  // 1. Calculate relative scale for every object: S = 10 ^ (ObjectExp - CurrentExp)
  // 2. If S is within a visible range (e.g., 0.001 to 1000), show it.
  // 3. Opacity logic for smooth transitions.

  let closestDist = 999;
  let activeObj = null;

  sceneObjects.forEach((obj) => {
    const scaleDiff = obj.userData.exponent - currentExp;

    // Standard size in view is scale 1.
    // If scaleDiff is 0, object is at 10^0 relative to camera, which equals 1 unit?
    // No, we want object to appear 1 unit size when slider == object.exponent.

    const scale = Math.pow(10, scaleDiff);

    // Apply Scale
    obj.scale.setScalar(scale);

    // Rotation (Animation)
    obj.rotation.y += 0.002;
    if (obj.userData.type === "atom") {
      obj.children[1].rotation.x += 0.01;
      obj.children[1].rotation.y += 0.01;
    }
    if (obj.userData.type === "proton") {
      obj.children.forEach((c) => {
        if (c.name === "quark") {
          c.position.addScaledVector(
            c.userData.axis,
            Math.sin(Date.now() * 0.005 + c.id) * 0.01
          );
        }
      });
    }

    // Visibility Logic
    // Visible if it's not too tiny (< 0.001) and not too huge (> 100)
    // But we also want to fade them in/out.

    const dist = Math.abs(scaleDiff);
    if (dist < closestDist) {
      closestDist = dist;
      activeObj = obj;
    }

    // Opacity/Visibility handling
    // We want the object to be fully opaque at scale 1 (scaleDiff=0)
    // And fade out as it gets to 0.01 or 100

    // Simple approach: Only render reasonable range
    if (scale > 0.0001 && scale < 10000) {
      obj.visible = true;
      // Transition logic could go here, but with solid objects Z-buffer handles most.
      // For transparency, it's harder.
    } else {
      obj.visible = false;
    }
  });

  // Update UI based on active object
  if (activeObj && closestDist < 2.5) {
    nameLabel.innerText = activeObj.userData.name;
    descLabel.innerText = activeObj.userData.desc;
  } else {
    // In the void between scales
    nameLabel.innerText = "Empty Space";
    descLabel.innerText = "Zooming...";
  }

  // Format scale text
  const val = currentExp;
  const pwr = Math.floor(val);
  // Display nice number
  scaleLabel.innerHTML = `10<sup>${val.toFixed(1)}</sup> meters`;

  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
