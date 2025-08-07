import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Html, Bounds } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { Loader } from './Loader';

// GLTF/GLB Model component with shadows
const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  return <primitive object={clonedScene} />;
};

// STL Model Component
const StlModel: React.FC<{ url: string }> = ({ url }) => {
  const geom = useLoader(STLLoader, url);
  
  const centeredGeom = React.useMemo(() => {
    const geometry = geom.clone();
    geometry.center();
    return geometry;
  }, [geom]);

  return (
    <mesh geometry={centeredGeom} castShadow receiveShadow>
      <meshStandardMaterial color={'#94a3b8'} flatShading={true} />
    </mesh>
  );
};

// OBJ Model Component
const ObjModel: React.FC<{ url: string }> = ({ url }) => {
    const originalObj = useLoader(OBJLoader, url);
    
    const centeredObj = React.useMemo(() => {
        const clone = originalObj.clone();
        const box = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box.getCenter(center);
        clone.position.sub(center);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [originalObj]);

    return <primitive object={centeredObj} />;
};


// A default object to show when nothing is loaded
const DefaultObject: React.FC = () => {
  return (
    <mesh>
      <icosahedronGeometry />
      <meshStandardMaterial color="#00ffff" wireframe />
    </mesh>
  );
};

interface ViewerProps {
  modelUrl: string | null;
  modelExt: string | null;
  autoRotate: boolean;
}

export const Viewer: React.FC<ViewerProps> = ({ modelUrl, modelExt, autoRotate }) => {
  const ModelComponent = React.useMemo(() => {
    if (!modelUrl || !modelExt) return () => <DefaultObject />;
    
    switch (modelExt) {
      case 'gltf':
      case 'glb':
        return () => <Model url={modelUrl} />;
      case 'stl':
        return () => <StlModel url={modelUrl} />;
      case 'obj':
        return () => <ObjModel url={modelUrl} />;
      default:
        return () => <DefaultObject />;
    }
  }, [modelUrl, modelExt]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
      <Suspense fallback={<Html center><Loader /></Html>}>
        <Environment preset="city" />
        <ambientLight intensity={1.2} />
        <directionalLight 
            position={[5, 10, 5]} 
            intensity={2.5} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />
        
        <Bounds fit clip observe margin={1.2}>
          <ModelComponent />
        </Bounds>

      </Suspense>
      <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={0.8} />
    </Canvas>
  );
};