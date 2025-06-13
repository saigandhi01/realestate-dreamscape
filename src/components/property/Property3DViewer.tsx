
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from 'lucide-react';

interface Property3DViewerProps {
  propertyName: string;
  propertyType: string;
}

const House3D = () => {
  const houseRef = useRef<any>();

  useFrame(() => {
    if (houseRef.current) {
      houseRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={houseRef}>
      {/* House base */}
      <Box position={[0, 0, 0]} args={[3, 2, 2]} material-color="#8B4513" />
      
      {/* Roof */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Door */}
      <Box position={[0, -0.5, 1.01]} args={[0.6, 1, 0.1]} material-color="#4A4A4A" />
      
      {/* Windows */}
      <Box position={[-0.8, 0.2, 1.01]} args={[0.6, 0.6, 0.1]} material-color="#87CEEB" />
      <Box position={[0.8, 0.2, 1.01]} args={[0.6, 0.6, 0.1]} material-color="#87CEEB" />
      
      {/* Chimney */}
      <Box position={[1, 2.5, -0.5]} args={[0.3, 1, 0.3]} material-color="#8B4513" />
    </group>
  );
};

const Property3DViewer = ({ propertyName, propertyType }: Property3DViewerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Home className="mr-2 h-5 w-5" />
          3D Property View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <House3D />
              <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Click and drag to rotate • Scroll to zoom
        </p>
      </CardContent>
    </Card>
  );
};

export default Property3DViewer;
