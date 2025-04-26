import React, { useEffect, useRef, useState } from 'react';

interface MojoCarrotProps {
  width?: number;
  height?: number;
}

const MojoCarrot: React.FC<MojoCarrotProps> = ({ width = 200, height = 250 }) => {
  const [eyePosition, setEyePosition] = useState({ leftX: 80, leftY: 140, rightX: 120, rightY: 140 });
  const [blinkProgress, setBlinkProgress] = useState(0); // 0 到 100 表示眨眼进度
  const svgRef = useRef<SVGSVGElement>(null);
  const blinkTimeoutRef = useRef<number | null>(null);
  const blinkAnimationRef = useRef<number | null>(null);

  // 处理鼠标移动事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current && blinkProgress < 20) { // 只有在眼睛大部分睁开时才跟踪鼠标
        // 获取SVG元素的位置
        const svgRect = svgRef.current.getBoundingClientRect();
        const svgCenterX = svgRect.left + svgRect.width / 2;
        const svgCenterY = svgRect.top + svgRect.height / 2;
        
        // 计算鼠标相对于SVG中心的位置
        const mouseX = e.clientX - svgCenterX;
        const mouseY = e.clientY - svgCenterY;
        
        // 计算眼睛移动的最大距离（像素）
        const maxEyeMove = 5;
        
        // 计算眼睛应该移动的距离，基于鼠标位置
        // 归一化鼠标位置，然后乘以最大移动距离
        const distanceX = Math.min(Math.max(mouseX / (window.innerWidth / 2), -1), 1) * maxEyeMove;
        const distanceY = Math.min(Math.max(mouseY / (window.innerHeight / 2), -1), 1) * maxEyeMove;
        
        // 更新眼睛位置
        setEyePosition({
          leftX: 80 + distanceX,
          leftY: 140 + distanceY,
          rightX: 120 + distanceX,
          rightY: 140 + distanceY
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [blinkProgress]);

  // 眨眼动画
  useEffect(() => {
    const startBlinking = () => {
      // 随机设置下次眨眼的时间 (2-6秒之间)
      const nextBlinkTime = 2000 + Math.random() * 4000;
      
      blinkTimeoutRef.current = window.setTimeout(() => {
        // 眨眼动画 - 从0到100再回到0
        let progress = 0;
        const animateBlinking = () => {
          if (progress <= 100) {
            setBlinkProgress(progress);
            progress += 10; // 每帧增加10%
            blinkAnimationRef.current = window.requestAnimationFrame(animateBlinking);
          } else {
            // 开始睁眼
            let decreaseProgress = 100;
            const reopenEyes = () => {
              if (decreaseProgress >= 0) {
                setBlinkProgress(decreaseProgress);
                decreaseProgress -= 10;
                blinkAnimationRef.current = window.requestAnimationFrame(reopenEyes);
              } else {
                // 眨眼结束
                setBlinkProgress(0);
                
                // 安排下一次眨眼
                startBlinking();
              }
            };
            reopenEyes();
          }
        };
        
        animateBlinking();
      }, nextBlinkTime);
    };
    
    // 开始眨眼循环
    startBlinking();
    
    // 组件卸载时清理定时器和动画帧
    return () => {
      if (blinkTimeoutRef.current) {
        window.clearTimeout(blinkTimeoutRef.current);
      }
      if (blinkAnimationRef.current) {
        window.cancelAnimationFrame(blinkAnimationRef.current);
      }
    };
  }, []);

  // 计算眼睛闭合比例 - 基于眨眼进度
  const getEyeOpenRatio = (progress: number) => {
    // 0 表示完全张开，100 表示完全闭合
    return 1 - (progress / 100);
  };

  return (
    <svg 
      ref={svgRef}
      width={width} 
      height={height} 
      viewBox="0 0 200 250" 
      style={{ maxWidth: '100%', maxHeight: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <circle cx="100" cy="150" r="75" fill="#F37720" />

      {/* 立体化叶子 */}
      <g id="leaves">
        {/* 中心叶 */}
        <path d="M100 75 C90 30,60 15,100 35 C140 15,110 30,100 75 Z" fill="#60D936">
          <animate attributeName="opacity" values="1;0.9;1" dur="2s" repeatCount="indefinite"/>
        </path>
        
        {/* 左侧叶 */}
        <path d="M100 75 C70 45,30 30,70 80 C85 90,95 90,100 75 Z" fill="url(#leafGradient)">
          <animate attributeName="fill" values="#60D936;#8CEB6C;#60D936" dur="3s" repeatCount="indefinite"/>
        </path>
        <path d="M80 75 Q65 60,70 80" stroke="#4BA82E" stroke-width="2" stroke-linejoin="round"/>
        
        {/* 右侧叶 */}
        <path d="M100 75 C130 45,170 30,130 80 C115 90,105 90,100 75 Z" fill="url(#leafGradient)">
          <animateTransform attributeName="transform" type="rotate" values="-2 100 75;2 100 75;-2 100 75" dur="4s" repeatCount="indefinite"/>
        </path>
        <path d="M120 75 Q135 60,130 80" stroke="#4BA82E" stroke-width="2" stroke-linejoin="round"/>
      </g>

      {/* 渐变定义 */}
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8CEB6C"/>
          <stop offset="100%" stop-color="#3A8F1E"/>
        </linearGradient>
      </defs>

      {/* 左眼 */}
      <g>
        {/* 眼白 */}
        <ellipse cx="80" cy="140" rx="12" ry="18" fill="white" />
        
        {/* 眼珠 - 眨眼时高度变小 */}
        <ellipse 
          cx={eyePosition.leftX} 
          cy={eyePosition.leftY} 
          rx="7" 
          ry={12 * getEyeOpenRatio(blinkProgress)} 
          fill="#0066CC" 
        />
        
        {/* 上眼皮 - 橙色，从上往下眨 */}
        <path 
          d={`M${80-12},${140 - 18 + blinkProgress * 0.36} 
              Q${80},${140 - 18 + blinkProgress * 0.36 + (blinkProgress * 0.18)} 
              ${80+12},${140 - 18 + blinkProgress * 0.36}
              Q${80},${140 - 18} 
              ${80-12},${140 - 18 + blinkProgress * 0.36} Z`} 
          fill="#F37720" 
        />
        
        {/* 下眼皮 - 橙色，从下往上眨 */}
        <path 
          d={`M${80-12},${140 + 18 - blinkProgress * 0.36} 
              Q${80},${140 + 18 - blinkProgress * 0.36 - (blinkProgress * 0.18)} 
              ${80+12},${140 + 18 - blinkProgress * 0.36}
              Q${80},${140 + 18} 
              ${80-12},${140 + 18 - blinkProgress * 0.36} Z`} 
          fill="#F37720" 
        />
      </g>

      {/* 右眼 */}
      <g>
        {/* 眼白 */}
        <ellipse cx="120" cy="140" rx="12" ry="18" fill="white" />
        
        {/* 眼珠 - 眨眼时高度变小 */}
        <ellipse 
          cx={eyePosition.rightX} 
          cy={eyePosition.rightY} 
          rx="7" 
          ry={12 * getEyeOpenRatio(blinkProgress)} 
          fill="#0066CC" 
        />
        
        {/* 上眼皮 - 橙色，从上往下眨 */}
        <path 
          d={`M${120-12},${140 - 18 + blinkProgress * 0.36} 
              Q${120},${140 - 18 + blinkProgress * 0.36 + (blinkProgress * 0.18)} 
              ${120+12},${140 - 18 + blinkProgress * 0.36}
              Q${120},${140 - 18} 
              ${120-12},${140 - 18 + blinkProgress * 0.36} Z`} 
          fill="#F37720" 
        />
        
        {/* 下眼皮 - 橙色，从下往上眨 */}
        <path 
          d={`M${120-12},${140 + 18 - blinkProgress * 0.36} 
              Q${120},${140 + 18 - blinkProgress * 0.36 - (blinkProgress * 0.18)} 
              ${120+12},${140 + 18 - blinkProgress * 0.36}
              Q${120},${140 + 18} 
              ${120-12},${140 + 18 - blinkProgress * 0.36} Z`} 
          fill="#F37720" 
        />
      </g>

      {/* Mouth (cat-like) */}
      <path d="M85 180 Q90 185, 95 180 Q100 175, 105 180 Q110 185, 115 180" stroke="black" stroke-width="4" fill="none" stroke-linecap="round" />
    </svg>
  );
};

export default MojoCarrot; 