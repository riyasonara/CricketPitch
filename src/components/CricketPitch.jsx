import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const CricketPitch = () => {
  const refContainer = useRef(null);
  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(15));
    // scene.add(new THREE.GridHelper(100,15));

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Define custom ellipse geometry
    function createEllipseGeometry(radiusX, radiusY, segments) {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const indices = [];

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = radiusX * Math.cos(theta);
        const z = radiusY * Math.sin(theta);
        positions.push(x, 0, z);
      }

      for (let i = 0; i < segments; i++) {
        indices.push(i, i + 1, segments);
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setIndex(indices);
      return geometry;
    }

    // Add ground ellipse geometry
    const groundGeometry = createEllipseGeometry(45, 50, 50);

    // Load grass texture
    const grass = new THREE.TextureLoader().load("grassTexture.jpg");

    // Create the pitch material with grass texture
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: grass,
      side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.y = -Math.PI / 2; // Rotate to lay flat on the x-y plane
    scene.add(ground);

    const innercurve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      25,
      24, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    let pts1 = innercurve.getSpacedPoints(100);
    pts1.forEach((p) => {
      p.z = -p.y;
      p.y = 0;
    }); // z = -y; y = 0

    let geometry = new THREE.BufferGeometry().setFromPoints(pts1);
    let material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 1,
      linewidth: 5,
    });
    let mesh = new THREE.Line(geometry, material);
    scene.add(mesh);

    // Dimensions of the pitch
    const pitchWidth = 5; // Width of the pitch
    const pitchLength = 16; // Length of the pitch
    const pitchHeight = 0.1; // Thickness of the pitch

    // Create a geometry for the pitch
    const pitchGeometry = new THREE.BoxGeometry(
      pitchWidth,
      pitchHeight,
      pitchLength
    );

    // Create a material with light brown color
    const pitchMaterial = new THREE.MeshBasicMaterial({ color: 0xe78e5f }); // Light brown color

    // Create the pitch mesh
    const pitchMesh = new THREE.Mesh(pitchGeometry, pitchMaterial);
    scene.add(pitchMesh);

    // Add stumps geometry (white color)
    const stumpsGeometry = new THREE.CylinderGeometry(
      0.04,
      0.04,
      1,
      12,
      1,
      false,
      0,
      6.283185307179586
    );
    const stumpsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const stump1 = new THREE.Mesh(stumpsGeometry, stumpsMaterial);
    const stump2 = new THREE.Mesh(stumpsGeometry, stumpsMaterial);
    const stump3 = new THREE.Mesh(stumpsGeometry, stumpsMaterial);
    const stump4 = new THREE.Mesh(stumpsGeometry, stumpsMaterial);
    const stump5 = new THREE.Mesh(stumpsGeometry, stumpsMaterial);
    const stump6 = new THREE.Mesh(stumpsGeometry, stumpsMaterial);
    stump1.position.set(0.2, 0.5, -6);
    stump2.position.set(0, 0.5, -6);
    stump3.position.set(-0.2, 0.5, -6);
    stump4.position.set(-0.2, 0.5, 6);
    stump5.position.set(0, 0.5, 6);
    stump6.position.set(0.2, 0.5, 6);
    scene.add(stump1);
    scene.add(stump2);
    scene.add(stump3);
    scene.add(stump4);
    scene.add(stump5);
    scene.add(stump6);

    // Create bails geometry
    const bailsGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 12); // Adjust dimensions as needed
    const bailsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color for bails

    // Create bails and position them between the stumps
    const bail1 = new THREE.Mesh(bailsGeometry, bailsMaterial);
    bail1.position.set(0.1, 1, -6); // Adjust position to place it between stump1 and stump2
    bail1.rotateZ(Math.PI / 2); // Rotate bail horizontally
    scene.add(bail1);

    const bail2 = new THREE.Mesh(bailsGeometry, bailsMaterial);
    bail2.position.set(-0.1, 1, -6); // Adjust position to place it between stump1 and stump2
    bail2.rotateZ(Math.PI / 2); // Rotate bail horizontally
    scene.add(bail2);

    const bail3 = new THREE.Mesh(bailsGeometry, bailsMaterial);
    bail3.position.set(0.1, 1, 6); // Adjust position to place it between stump4 and stump5
    bail3.rotateZ(Math.PI / 2); // Rotate bail horizontally
    scene.add(bail3);

    const bail4 = new THREE.Mesh(bailsGeometry, bailsMaterial);
    bail4.position.set(-0.1, 1, 6); // Adjust position to place it between stump4 and stump5
    bail4.rotateZ(Math.PI / 2); // Rotate bail horizontally
    scene.add(bail4);

    // Create blue material for wide lines
    const wideLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Define width and height of the wide lines
    const wideLineWidth = 0.02;
    const wideLineHeight = pitchHeight + 0.01; // Make it slightly taller than pitch

    // Create the geometry for wide lines
    const wideLineGeometry = new THREE.BoxGeometry(
      wideLineWidth,
      wideLineHeight,
      pitchWidth
    );

    // Create wide line before stumps (one end)
    const leftWideLineFront = new THREE.Mesh(
      wideLineGeometry,
      wideLineMaterial
    );
    leftWideLineFront.position.set(0, 0, -5.5);
    leftWideLineFront.rotateY(300);
    scene.add(leftWideLineFront);

    const leftWideLineBack = new THREE.Mesh(wideLineGeometry, wideLineMaterial);
    leftWideLineBack.position.set(0, 0, -6.5);
    leftWideLineBack.rotateY(300);
    scene.add(leftWideLineBack);

    // Create side line before stumps (one end)
    const leftSideLineFront = new THREE.Mesh(
      wideLineGeometry,
      wideLineMaterial
    );
    leftSideLineFront.position.set(-2, 0, -6);
    scene.add(leftSideLineFront);

    const rightSideLineFront = new THREE.Mesh(
      wideLineGeometry,
      wideLineMaterial
    );
    rightSideLineFront.position.set(2, 0, -6);
    scene.add(rightSideLineFront);

    // Create wide line before stumps (second end)
    const rightWideLineFront = new THREE.Mesh(
      wideLineGeometry,
      wideLineMaterial
    );
    rightWideLineFront.position.set(0, 0, 5.5);
    rightWideLineFront.rotateY(300);
    scene.add(rightWideLineFront);

    const rightWideLineBack = new THREE.Mesh(
      wideLineGeometry,
      wideLineMaterial
    );
    rightWideLineBack.position.set(0, 0, 6.5);
    rightWideLineBack.rotateY(300);
    scene.add(rightWideLineBack);

    // Create side line before stumps (one end)
    const leftSideLineBack = new THREE.Mesh(wideLineGeometry, wideLineMaterial);
    leftSideLineBack.position.set(2, 0, 6);
    scene.add(leftSideLineBack);

    const rightSideLineBack = new THREE.Mesh(
      wideLineGeometry,
      wideLineMaterial
    );
    rightSideLineBack.position.set(-2, 0, 6);
    scene.add(rightSideLineBack);

    // Position the camera
    camera.position.set(0, 50, 50);
    camera.lookAt(0, 0, 0);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // smooths out camera movement

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // directionalLight.position.set(0, 1, 0);
    // scene.add(directionalLight);

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // Update orbit controls
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return <div ref={refContainer}></div>;
};

export default CricketPitch;
