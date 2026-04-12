import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameCount = 120;
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        // Fallback to placeholder if frames are missing
        img.src = `/frames/frame_${i}.webp`;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frameCount) {
            setIsLoaded(true);
          }
        };
        img.onerror = () => {
          // If frames are missing, we'll just use a placeholder logic in the draw function
          loadedCount++;
          if (loadedCount === frameCount) {
            setIsLoaded(true);
          }
        };
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    loadImages();
  }, []);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      const index = Math.floor(frameIndex.get());
      const img = images[index];

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (img && img.complete && img.naturalWidth !== 0) {
        // Draw image
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // Fallback: Draw a futuristic grid/pattern if frames are missing
        const time = Date.now() * 0.001;
        
        // Draw background glow
        const gradient = context.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(10, 15, 28, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw animated grid
        context.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        context.lineWidth = 1;
        
        const gridSize = 100;
        const offsetX = (time * 50) % gridSize;
        const offsetY = (time * 50) % gridSize;

        context.beginPath();
        for (let x = offsetX; x < canvas.width; x += gridSize) {
          context.moveTo(x, 0);
          context.lineTo(x, canvas.height);
        }
        for (let y = offsetY; y < canvas.height; y += gridSize) {
          context.moveTo(0, y);
          context.lineTo(canvas.width, y);
        }
        context.stroke();

        // Draw scanning line
        const scanY = (time * 200) % canvas.height;
        const scanGradient = context.createLinearGradient(0, scanY - 50, 0, scanY);
        scanGradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        scanGradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)');
        context.fillStyle = scanGradient;
        context.fillRect(0, scanY - 50, canvas.width, 50);
        
        context.strokeStyle = '#3B82F6';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, scanY);
        context.lineTo(canvas.width, scanY);
        context.stroke();

        // Draw text
        context.shadowBlur = 20;
        context.shadowColor = '#3B82F6';
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 64px serif';
        context.textAlign = 'center';
        context.fillText('TRUTH LENS', canvas.width / 2, canvas.height / 2);
        
        context.shadowBlur = 0;
        context.fillStyle = 'rgba(229, 231, 235, 0.6)';
        context.font = '14px sans-serif';
        context.letterSpacing = '4px';
        context.fillText('AI-POWERED VERIFICATION SYSTEM', canvas.width / 2, canvas.height / 2 + 60);
      }

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [images, frameIndex]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-bg-primary">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="h-full w-full object-cover opacity-40"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <motion.h1 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
              className="text-7xl md:text-9xl font-serif font-black mb-4 tracking-tighter text-white"
            >
              Truth Lens
            </motion.h1>
            
            <motion.p
              style={{ 
                opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0]),
                scale: useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0.8, 1, 1.2])
              }}
              className="text-3xl md:text-5xl font-serif text-accent-blue"
            >
              Detect Fake News Instantly
            </motion.p>

            <motion.p
              style={{ 
                opacity: useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 0]),
              }}
              className="text-3xl md:text-5xl font-serif text-accent-green"
            >
              AI-Powered Fact Verification
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-text-secondary text-sm uppercase tracking-widest mb-4">Scroll to Analyze</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent-blue to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};
