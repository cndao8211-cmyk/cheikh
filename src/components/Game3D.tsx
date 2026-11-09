import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Pause, Play, RotateCcw, ArrowRight, Trophy, Sparkles } from 'lucide-react';

interface Game3DProps {
  onExitGame: () => void;
  onOpenStore: () => void;
}

type GameState = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';

export const Game3D: React.FC<Game3DProps> = ({ onExitGame, onOpenStore }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('title');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [cfaProfit, setCfaProfit] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    prompt: string;
    choices: string[];
    correct: number;
    reward: number;
  } | null>(null);

  // Audio synthesis refs
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthSound = (type: 'pickup' | 'win' | 'engine' | 'hit') => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'pickup') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio fallback silent
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Renderer setup conforming strictly to threejs directives
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0ede6);
    scene.fog = new THREE.FogExp2(0xf0ede6, 0.018);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 14, 22);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // 2. Studio Lighting: Warm Directional Key + Cool Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0xfff7e6, 0x446655, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    const d = 30;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // 3. Procedural River & Terrain Geometry
    // Ground plane with sand & river texture
    const groundGeo = new THREE.PlaneGeometry(160, 200, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdfd3b8, // warm desert sand
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Procedural River ribbon (representing Senegal River)
    const riverGeo = new THREE.PlaneGeometry(24, 200, 16, 32);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x337799,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.92,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.y = 0.04; // offset above ground to avoid z-fighting
    river.receiveShadow = true;
    scene.add(river);

    // 4. Hero Subject: Composite 3-12 Part Procedural Caravan Ship / Cart
    // (Three.js Directive: Never represent a hero subject with a single default primitive)
    const caravanGroup = new THREE.Group();

    // Part 1: Main Wooden Hull (Primary silhouette)
    const hullGeo = new THREE.BoxGeometry(2.4, 0.8, 4.6);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x5a3318,
      roughness: 0.75,
      metalness: 0.1,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 0.5;
    hull.castShadow = true;
    caravanGroup.add(hull);

    // Part 2: Prow/Front Bevel
    const prowGeo = new THREE.ConeGeometry(1.2, 1.4, 4);
    const prow = new THREE.Mesh(prowGeo, hullMat);
    prow.rotation.x = Math.PI / 2;
    prow.rotation.y = Math.PI / 4;
    prow.position.set(0, 0.5, -2.7);
    prow.castShadow = true;
    caravanGroup.add(prow);

    // Part 3: Secondary Read - Traditional African White/Gold Fabric Canopy
    const canopyGeo = new THREE.CylinderGeometry(1.3, 1.4, 2.8, 8, 1, false, 0, Math.PI);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xf5eedb,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.position.set(0, 1.3, 0.2);
    canopy.castShadow = true;
    caravanGroup.add(canopy);

    // Part 4: Brass Lantern & Accent Trim
    const lanternGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 6);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // gold
      roughness: 0.2,
      metalness: 0.9,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 1.6, -2.1);
    lantern.castShadow = true;
    caravanGroup.add(lantern);

    // Part 5: Cargo Crates of Peanuts & Gold
    const crateGeo = new THREE.BoxGeometry(0.7, 0.6, 0.7);
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const crate1 = new THREE.Mesh(crateGeo, crateMat);
    crate1.position.set(-0.5, 0.9, 0.6);
    caravanGroup.add(crate1);

    const crate2 = new THREE.Mesh(crateGeo, crateMat);
    crate2.position.set(0.5, 0.9, 0.6);
    caravanGroup.add(crate2);

    // Soft Radial Contact Shadow beneath caravan
    const shadowGeo = new THREE.PlaneGeometry(3.6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.05;
    caravanGroup.add(contactShadow);

    scene.add(caravanGroup);

    // 5. Instanced Procedural Baobab Trees along banks
    const treeCount = 28;
    const treeTrunkGeo = new THREE.CylinderGeometry(0.9, 1.4, 4.5, 7);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x6e523b, roughness: 0.9 });
    const treeFoliageGeo = new THREE.DodecahedronGeometry(2.2, 1);
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x2e5c2a, roughness: 0.7 });

    for (let i = 0; i < treeCount; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
      foliage.position.y = 5.2;
      foliage.castShadow = true;
      tree.add(foliage);

      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (16 + Math.random() * 20);
      const z = (i - treeCount / 2) * 8 + Math.random() * 4;
      tree.position.set(x, 0, z);
      scene.add(tree);
    }

    // 6. Collectibles: Gold Ingots (شركة IE Capital) and Manuscripts (العلم والمعرفة)
    const collectibles: {
      mesh: THREE.Group;
      type: 'gold' | 'book';
      value: number;
      initialY: number;
    }[] = [];

    const goldGeo = new THREE.BoxGeometry(0.8, 0.3, 1.4);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.15,
      metalness: 0.95,
    });

    const bookGeo = new THREE.BoxGeometry(0.9, 0.25, 1.2);
    const bookMat = new THREE.MeshStandardMaterial({
      color: 0x1e6b4d, // emerald Islamic manuscript
      roughness: 0.6,
      metalness: 0.2,
    });

    for (let i = 0; i < 18; i++) {
      const itemGroup = new THREE.Group();
      const isBook = i % 2 === 0;
      const mesh = new THREE.Mesh(isBook ? bookGeo : goldGeo, isBook ? bookMat : goldMat);
      mesh.castShadow = true;
      itemGroup.add(mesh);

      const posX = (Math.random() - 0.5) * 16;
      const posZ = -70 + i * 8 + Math.random() * 3;
      itemGroup.position.set(posX, 1.2, posZ);
      scene.add(itemGroup);

      collectibles.push({
        mesh: itemGroup,
        type: isBook ? 'book' : 'gold',
        value: isBook ? 50 : 2500, // 2500 FCFA profit or 50 knowledge points
        initialY: 1.2,
      });
    }

    // 7. Input Controller
    const keys = {
      w: false,
      s: false,
      a: false,
      d: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) {
        keys[e.key as keyof typeof keys] = true;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        setGameState((prev) => (prev === 'title' ? 'playing' : prev));
      }
      if (e.key === 'Escape') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) {
        keys[e.key as keyof typeof keys] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 8. 60fps Game Loop with clock delta
    const clock = new THREE.Clock();
    let animId = 0;
    const speed = 12;

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);

      // Animation of water waves & collectibles rotation
      const time = clock.getElapsedTime();
      collectibles.forEach((item, idx) => {
        item.mesh.rotation.y += 1.8 * dt;
        item.mesh.position.y = item.initialY + Math.sin(time * 3 + idx) * 0.2;
      });

      // Player Movement
      const movingUp = keys.w || keys.ArrowUp;
      const movingDown = keys.s || keys.ArrowDown;
      const movingLeft = keys.a || keys.ArrowLeft;
      const movingRight = keys.d || keys.ArrowRight;

      if (movingUp) caravanGroup.position.z -= speed * dt;
      if (movingDown) caravanGroup.position.z += (speed * 0.7) * dt;
      if (movingLeft) {
        caravanGroup.position.x -= (speed * 0.9) * dt;
        caravanGroup.rotation.y = THREE.MathUtils.damp(caravanGroup.rotation.y, 0.25, 8, dt);
      } else if (movingRight) {
        caravanGroup.position.x += (speed * 0.9) * dt;
        caravanGroup.rotation.y = THREE.MathUtils.damp(caravanGroup.rotation.y, -0.25, 8, dt);
      } else {
        caravanGroup.rotation.y = THREE.MathUtils.damp(caravanGroup.rotation.y, 0, 8, dt);
      }

      // Constrain caravan boundaries
      caravanGroup.position.x = THREE.MathUtils.clamp(caravanGroup.position.x, -11, 11);
      caravanGroup.position.z = THREE.MathUtils.clamp(caravanGroup.position.z, -85, 20);

      // Camera Follows with smooth damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, caravanGroup.position.x, 4, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, caravanGroup.position.z + 18, 4, dt);

      // Collision Detection with Collectibles
      collectibles.forEach((c) => {
        if (!c.mesh.visible) return;
        const dist = caravanGroup.position.distanceTo(c.mesh.position);
        if (dist < 2.2) {
          c.mesh.visible = false;
          playSynthSound('pickup');
          if (c.type === 'gold') {
            setCoins((prev) => prev + 1);
            setCfaProfit((prev) => prev + c.value);
          } else {
            setScore((prev) => prev + c.value);
          }
        }
      });

      // Victory Condition when reaching historic destination
      if (caravanGroup.position.z <= -80) {
        setGameState('victory');
        playSynthSound('win');
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isMuted]);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 text-white overflow-hidden select-none">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Title Screen Overlay (Mandatory Full-Viewport Game Shell) */}
      {gameState === 'title' && (
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col justify-between p-8 sm:p-12 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                IE
              </span>
              <span className="text-xs text-stone-300 font-bold">شركة IE للألعاب والتعليم التفاعلي ثلاثي الأبعاد</span>
            </div>
            <button
              onClick={onExitGame}
              className="text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-lg border border-stone-800"
            >
              العودة للمنصة الرئيسية
            </button>
          </div>

          {/* Bespoke SVG Title Lockup over 30-40% negative space */}
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <svg
              className="w-48 sm:w-64 h-auto mx-auto"
              viewBox="0 0 300 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="300" height="80" rx="16" fill="#1c1917" stroke="#059669" strokeWidth="2" />
              <text x="150" y="42" fill="#34d399" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="Cairo">
                قوافل السنغال 3D
              </text>
              <text x="150" y="62" fill="#d6d3d1" fontSize="12" textAnchor="middle" fontFamily="Cairo">
                رحلة الممالك والتجارة والأرباح
              </text>
            </svg>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              استكشف ممالك السنغال، اجمع الثروات، وحقق أرباح شركتك
            </h1>
            <p className="text-stone-300 text-sm max-w-lg mx-auto leading-relaxed">
              تحكم بقافلة التجارة والمعرفة على ضفاف نهر السنغال التاريخي. اجمع سبائك الذهب ومخطوطات كبار العلماء، وافتح رخص الاستثمار.
            </p>

            {/* Primary Start CTA */}
            <div className="pt-4">
              <button
                onClick={() => setGameState('playing')}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>اضغط لبدء المغامرة الآن</span>
              </button>
            </div>

            {/* Flat control-hint line */}
            <div className="text-xs text-stone-400 font-mono pt-2">
              WASD / الأسهم للحركة · مسافة للبدء · Esc للإيقاف المؤقت
            </div>
          </div>

          <div className="text-center text-xs text-stone-500">
            بإشراف فضيلة الشيخ تيجان ا نداو © مجموعة IE القابضة
          </div>
        </div>
      )}

      {/* World-Matched, Low-Occlusion UI (>85% unobstructed) */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
          {/* Top Status Cluster in Game World Palette with tabular-nums */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-4 bg-stone-900/90 border border-stone-700/80 rounded-xl px-4 py-2.5 shadow-md">
              <div>
                <span className="text-[10px] text-stone-400 block">نقاط المعرفة</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">{score}</span>
              </div>
              <div className="w-px h-6 bg-stone-700" />
              <div>
                <span className="text-[10px] text-stone-400 block">سبائك الذهب</span>
                <span className="text-lg font-bold text-amber-400 tabular-nums">{coins}</span>
              </div>
              <div className="w-px h-6 bg-stone-700" />
              <div>
                <span className="text-[10px] text-stone-400 block">أرباح الشركة (FCFA)</span>
                <span className="text-lg font-bold text-sky-400 tabular-nums">{cfaProfit.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-700 text-stone-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setGameState('paused')}
                className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-700 text-stone-300 hover:text-white"
              >
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Dock Control Hint */}
          <div className="text-center text-xs text-stone-300 bg-stone-950/70 py-1.5 px-4 rounded-full mx-auto border border-stone-800">
            تقدم بالقافلة على مسار النهر نحو داكار وسانت لويس للوصول إلى خط النهاية
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-6 z-30">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
            <h3 className="text-xl font-bold text-white">اللعبة متوقفة مؤقتاً</h3>
            <p className="text-xs text-stone-400">
              يمكنك استئناف الرحلة التجارية أو العودة لأقسام الشركة والمنصة التعليمية.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
              >
                استئناف اللعب
              </button>
              <button
                onClick={onExitGame}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 font-semibold text-xs text-stone-300"
              >
                الخروج للمنصة الرئيسية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory / Profit Report Modal */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-6 z-30">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-700">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              تهانينا! اكتملت القافلة بنجاح
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              وصلت قافلتك إلى مراكز التجارة والتعليم الكبرى، محققة أرباحاً تجارية وقيمة معرفية لشركة ومعهد IE!
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-950 border border-stone-800 text-right">
              <div>
                <span className="text-xs text-stone-500">الأرباح التجارية:</span>
                <div className="text-lg font-bold text-sky-400 tabular-nums">
                  {cfaProfit.toLocaleString()} FCFA
                </div>
              </div>
              <div>
                <span className="text-xs text-stone-500">المعرفة المحصلة:</span>
                <div className="text-lg font-bold text-emerald-400 tabular-nums">
                  {score} نقطة
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={onOpenStore}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white"
              >
                استثمار الأرباح في متجر IE
              </button>
              <button
                onClick={onExitGame}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 font-semibold text-xs text-stone-300"
              >
                العودة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
