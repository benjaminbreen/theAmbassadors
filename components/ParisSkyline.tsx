import React, { useMemo } from 'react';
import { TimeColors } from '../utils/timeOfDay';

interface ParisSkylineProps {
  timeColors: TimeColors;
  hour: number;
  minute: number;
}

/**
 * Paris 1889 Sky and Skyline
 * Realistic Parisian landscape with:
 * - Seine river
 * - Tree line
 * - Street-level buildings
 * - Notre-Dame, Sacré-Cœur, church spires
 */
const ParisSkyline: React.FC<ParisSkylineProps> = ({ timeColors, hour, minute }) => {
  // Calculate sun/moon position
  const celestialPosition = useMemo(() => {
    const totalMinutes = hour * 60 + minute;
    const dayProgress = (totalMinutes - 360) / (1200 - 360);
    const clampedProgress = Math.max(0, Math.min(1, dayProgress));
    const x = 5 + clampedProgress * 90;
    const normalizedX = (clampedProgress - 0.5) * 2;
    const y = 75 - (1 - normalizedX * normalizedX) * 60;
    return { x, y, isVisible: hour >= 6 && hour < 20 };
  }, [hour, minute]);

  const moonPosition = useMemo(() => {
    const totalMinutes = hour * 60 + minute;
    let nightProgress;
    if (hour >= 20) {
      nightProgress = (totalMinutes - 1200) / (1440 - 1200 + 360);
    } else if (hour < 6) {
      nightProgress = (totalMinutes + 240) / 600;
    } else {
      nightProgress = -1;
    }
    const clampedProgress = Math.max(0, Math.min(1, nightProgress));
    const x = 10 + clampedProgress * 80;
    const normalizedX = (clampedProgress - 0.5) * 2;
    const y = 70 - (1 - normalizedX * normalizedX) * 50;
    return { x, y, isVisible: hour >= 20 || hour < 6 };
  }, [hour, minute]);

  // Colors based on time of day - more natural, less purple
  const sceneColors = useMemo(() => {
    if (hour >= 6 && hour < 9) {
      // Morning - warm golden light
      return {
        farBuildings: '#8a7d75',
        midBuildings: '#6d5f55',
        nearBuildings: '#4a3d35',
        trees: '#3d4a35',
        treesLight: '#4d5a42',
        river: '#5a7080',
        riverHighlight: '#7a95a8',
        riverBank: '#5a5045',
        street: '#3a3530',
        windows: 'rgba(255,210,160,0.4)',
      };
    } else if (hour >= 9 && hour < 17) {
      // Midday - clear natural light
      return {
        farBuildings: '#9a9590',
        midBuildings: '#7a7570',
        nearBuildings: '#5a5550',
        trees: '#4a5a40',
        treesLight: '#5a6a4d',
        river: '#5080a0',
        riverHighlight: '#70a0c0',
        riverBank: '#6a6055',
        street: '#4a4540',
        windows: 'rgba(100,130,160,0.2)',
      };
    } else if (hour >= 17 && hour < 20) {
      // Evening - golden hour
      return {
        farBuildings: '#9a8070',
        midBuildings: '#7a6050',
        nearBuildings: '#5a4030',
        trees: '#4a5035',
        treesLight: '#5a6040',
        river: '#607590',
        riverHighlight: '#8095a8',
        riverBank: '#5a4a3a',
        street: '#3a3025',
        windows: 'rgba(255,190,120,0.5)',
      };
    } else {
      // Night
      return {
        farBuildings: '#303540',
        midBuildings: '#252a30',
        nearBuildings: '#1a1d22',
        trees: '#1a2218',
        treesLight: '#252d20',
        river: '#1a2530',
        riverHighlight: '#253545',
        riverBank: '#252220',
        street: '#151412',
        windows: 'rgba(255,200,120,0.7)',
      };
    }
  }, [hour]);

  // Scattered clouds
  const clouds = useMemo(() => {
    return [
      { id: 0, x: 5, y: 12, scale: 0.9, duration: 400, opacity: 0.5 },
      { id: 1, x: 30, y: 6, scale: 0.6, duration: 450, opacity: 0.4 },
      { id: 2, x: 60, y: 18, scale: 1.0, duration: 380, opacity: 0.45 },
      { id: 3, x: 85, y: 10, scale: 0.75, duration: 420, opacity: 0.5 },
      { id: 4, x: 45, y: 25, scale: 0.5, duration: 390, opacity: 0.35 },
    ].map(c => ({
      ...c,
      opacity: timeColors.isDay ? c.opacity : c.opacity * 0.25,
    }));
  }, [timeColors.isDay]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            ${timeColors.skyTop} 0%,
            ${timeColors.skyMid} 40%,
            ${timeColors.skyBottom} 80%,
            ${timeColors.skyBottom} 100%)`,
          transition: 'background 3s ease-in-out',
        }}
      />

      {/* Sun */}
      {celestialPosition.isVisible && (
        <div
          className="absolute"
          style={{
            left: `${celestialPosition.x}%`,
            top: `${celestialPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: '80px',
              height: '80px',
              left: '-26px',
              top: '-26px',
              background: `radial-gradient(circle,
                rgba(255,240,200,0.35) 0%,
                rgba(255,210,140,0.12) 50%,
                transparent 70%)`,
              filter: 'blur(4px)',
            }}
          />
          <div
            className="rounded-full"
            style={{
              width: '26px',
              height: '26px',
              background: `radial-gradient(circle at 35% 35%,
                #FFFEFA 0%,
                #FFE580 50%,
                #FFCC44 100%)`,
              boxShadow: '0 0 10px rgba(255,200,100,0.5)',
            }}
          />
        </div>
      )}

      {/* Moon */}
      {moonPosition.isVisible && (
        <div
          className="absolute"
          style={{
            left: `${moonPosition.x}%`,
            top: `${moonPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: '45px',
              height: '45px',
              left: '-12px',
              top: '-12px',
              background: `radial-gradient(circle, rgba(200,210,230,0.2) 0%, transparent 60%)`,
              filter: 'blur(4px)',
            }}
          />
          <div
            className="rounded-full"
            style={{
              width: '20px',
              height: '20px',
              background: `radial-gradient(circle at 60% 40%, #F5F5FA 0%, #D8D8E8 100%)`,
              boxShadow: '0 0 8px rgba(200,210,230,0.3)',
            }}
          />
        </div>
      )}

      {/* Clouds */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.25" />
          </filter>
        </defs>
        {clouds.map((cloud) => (
          <g key={cloud.id} filter="url(#cloudBlur)" opacity={cloud.opacity}>
            <ellipse cx={cloud.x} cy={cloud.y} rx={4.5 * cloud.scale} ry={1.5 * cloud.scale} fill={timeColors.isDay ? '#fff' : '#556'}>
              <animate attributeName="cx" values={`${cloud.x};${cloud.x + 110};${cloud.x}`} dur={`${cloud.duration}s`} repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={cloud.x - 2 * cloud.scale} cy={cloud.y + 0.4} rx={2.8 * cloud.scale} ry={1.1 * cloud.scale} fill={timeColors.isDay ? '#fff' : '#556'}>
              <animate attributeName="cx" values={`${cloud.x - 2 * cloud.scale};${cloud.x + 108 - 2 * cloud.scale};${cloud.x - 2 * cloud.scale}`} dur={`${cloud.duration}s`} repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={cloud.x + 2 * cloud.scale} cy={cloud.y - 0.3} rx={3.2 * cloud.scale} ry={1.2 * cloud.scale} fill={timeColors.isDay ? '#fff' : '#556'}>
              <animate attributeName="cx" values={`${cloud.x + 2 * cloud.scale};${cloud.x + 112 + 2 * cloud.scale};${cloud.x + 2 * cloud.scale}`} dur={`${cloud.duration}s`} repeatCount="indefinite" />
            </ellipse>
          </g>
        ))}
      </svg>

      {/* Full Paris Scene */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: '38%' }}>
        <svg viewBox="0 0 1920 500" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sceneColors.riverHighlight} />
              <stop offset="100%" stopColor={sceneColors.river} />
            </linearGradient>
            <linearGradient id="farGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sceneColors.farBuildings} stopOpacity="0.9" />
              <stop offset="100%" stopColor={sceneColors.farBuildings} />
            </linearGradient>
            <linearGradient id="midGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sceneColors.midBuildings} stopOpacity="0.95" />
              <stop offset="100%" stopColor={sceneColors.midBuildings} />
            </linearGradient>
            <linearGradient id="nearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sceneColors.nearBuildings} />
              <stop offset="100%" stopColor={sceneColors.nearBuildings} />
            </linearGradient>
          </defs>

          {/* FAR LAYER - Distant buildings on horizon */}
          <path
            fill="url(#farGrad)"
            d="M0 500 L0 220
               L60 220 L60 210 L70 205 L80 210 L80 220
               L150 220 L150 208 L165 200 L180 208 L180 220
               L260 220 L260 212 L275 205 L290 212 L290 220
               L380 220 L380 205 L395 195 L410 205 L410 220
               L500 220 L500 215 L515 208 L530 215 L530 220
               L620 220 L620 210 L635 202 L650 210 L650 220
               L750 220 L750 212 L765 205 L780 212 L780 220
               L880 220 L880 208 L895 198 L910 208 L910 220
               L1010 220 L1010 215 L1025 208 L1040 215 L1040 220
               L1140 220 L1140 210 L1155 202 L1170 210 L1170 220
               L1270 220 L1270 212 L1285 205 L1300 212 L1300 220
               L1400 220 L1400 208 L1415 198 L1430 208 L1430 220
               L1530 220 L1530 215 L1545 208 L1560 215 L1560 220
               L1660 220 L1660 210 L1675 202 L1690 210 L1690 220
               L1790 220 L1790 212 L1805 205 L1820 212 L1820 220
               L1920 220 L1920 500 Z"
          />

          {/* Distant spires */}
          <g fill={sceneColors.farBuildings}>
            <path d="M395 195 L400 165 L405 195 Z" />
            <path d="M635 202 L640 175 L645 202 Z" />
            <path d="M1155 202 L1160 170 L1165 202 Z" />
          </g>

          {/* Sacré-Cœur in distance */}
          <g fill={sceneColors.farBuildings} opacity="0.95">
            <path d="M1600 220 L1600 195 L1610 185 L1620 180 L1630 178 L1640 180 L1650 185 L1660 195 L1660 220 Z" />
            <ellipse cx="1620" cy="188" rx="8" ry="10" />
            <ellipse cx="1640" cy="188" rx="8" ry="10" />
            <ellipse cx="1630" cy="182" rx="12" ry="14" />
            <path d="M1627 165 L1630 150 L1633 165 Z" />
          </g>

          {/* MID LAYER - Haussmann buildings */}
          <path
            fill="url(#midGrad)"
            d="M0 500 L0 260
               L45 260 L45 245 L55 235 L65 245 L65 260
               L120 260 L120 250 L130 238 L140 250 L140 260
               L200 260 L200 248 L212 236 L224 248 L224 260
               L290 260 L290 252 L302 240 L314 252 L314 260
               L380 260 L380 255 L390 245 L400 255 L400 260
               L470 260 L470 248 L482 236 L494 248 L494 260
               L560 260 L560 252 L572 240 L584 252 L584 260
               L650 260 L650 255 L660 245 L670 255 L670 260
               L740 260 L740 248 L752 236 L764 248 L764 260
               L830 260 L830 252 L842 240 L854 252 L854 260
               L920 260 L920 255 L930 245 L940 255 L940 260
               L1010 260 L1010 248 L1022 236 L1034 248 L1034 260
               L1100 260 L1100 252 L1112 240 L1124 252 L1124 260
               L1190 260 L1190 255 L1200 245 L1210 255 L1210 260
               L1280 260 L1280 248 L1292 236 L1304 248 L1304 260
               L1370 260 L1370 252 L1382 240 L1394 252 L1394 260
               L1460 260 L1460 255 L1470 245 L1480 255 L1480 260
               L1550 260 L1550 248 L1562 236 L1574 248 L1574 260
               L1640 260 L1640 252 L1652 240 L1664 252 L1664 260
               L1730 260 L1730 255 L1740 245 L1750 255 L1750 260
               L1820 260 L1820 248 L1832 236 L1844 248 L1844 260
               L1920 260 L1920 500 Z"
          />

          {/* Notre-Dame - prominent */}
          <g fill={sceneColors.midBuildings}>
            <rect x="800" y="220" width="90" height="40" />
            <rect x="800" y="185" width="22" height="35" />
            <rect x="868" y="185" width="22" height="35" />
            <path d="M800 185 L811 168 L822 185 Z" />
            <path d="M868 185 L879 168 L890 185 Z" />
            <path d="M840 220 L845 155 L850 220 Z" />
          </g>

          {/* TREE LINE - Along the Seine */}
          <g fill={sceneColors.trees}>
            {/* Left bank trees */}
            {[30, 70, 110, 160, 210, 270, 330, 400, 480, 560, 640, 720, 950, 1030, 1120, 1210, 1300, 1400, 1500, 1600, 1700, 1800, 1880].map((x, i) => (
              <g key={`tree-${i}`}>
                <ellipse cx={x} cy={295} rx={18 + (i % 3) * 4} ry={22 + (i % 4) * 3} fill={i % 2 === 0 ? sceneColors.trees : sceneColors.treesLight} />
                <ellipse cx={x - 8} cy={300} rx={12 + (i % 2) * 3} ry={16 + (i % 3) * 2} fill={sceneColors.treesLight} opacity="0.8" />
                <ellipse cx={x + 10} cy={298} rx={14 + (i % 3) * 2} ry={18 + (i % 2) * 3} fill={sceneColors.trees} opacity="0.9" />
              </g>
            ))}
          </g>

          {/* SEINE RIVER */}
          <rect x="0" y="320" width="1920" height="55" fill="url(#riverGrad)" />

          {/* River reflections/ripples */}
          <g stroke={sceneColors.riverHighlight} strokeWidth="0.8" opacity="0.3">
            <path d="M0 335 Q50 333 100 335 Q150 337 200 335 Q250 333 300 335 Q350 337 400 335 Q450 333 500 335 Q550 337 600 335 Q650 333 700 335 Q750 337 800 335 Q850 333 900 335 Q950 337 1000 335 Q1050 333 1100 335 Q1150 337 1200 335 Q1250 333 1300 335 Q1350 337 1400 335 Q1450 333 1500 335 Q1550 337 1600 335 Q1650 333 1700 335 Q1750 337 1800 335 Q1850 333 1900 335 L1920 335">
              <animate attributeName="d" values="M0 335 Q50 333 100 335 Q150 337 200 335 Q250 333 300 335 Q350 337 400 335 Q450 333 500 335 Q550 337 600 335 Q650 333 700 335 Q750 337 800 335 Q850 333 900 335 Q950 337 1000 335 Q1050 333 1100 335 Q1150 337 1200 335 Q1250 333 1300 335 Q1350 337 1400 335 Q1450 333 1500 335 Q1550 337 1600 335 Q1650 333 1700 335 Q1750 337 1800 335 Q1850 333 1900 335 L1920 335;M0 335 Q50 337 100 335 Q150 333 200 335 Q250 337 300 335 Q350 333 400 335 Q450 337 500 335 Q550 333 600 335 Q650 337 700 335 Q750 333 800 335 Q850 337 900 335 Q950 333 1000 335 Q1050 337 1100 335 Q1150 333 1200 335 Q1250 337 1300 335 Q1350 333 1400 335 Q1450 337 1500 335 Q1550 333 1600 335 Q1650 337 1700 335 Q1750 333 1800 335 Q1850 337 1900 335 L1920 335;M0 335 Q50 333 100 335 Q150 337 200 335 Q250 333 300 335 Q350 337 400 335 Q450 333 500 335 Q550 337 600 335 Q650 333 700 335 Q750 337 800 335 Q850 333 900 335 Q950 337 1000 335 Q1050 333 1100 335 Q1150 337 1200 335 Q1250 333 1300 335 Q1350 337 1400 335 Q1450 333 1500 335 Q1550 337 1600 335 Q1650 333 1700 335 Q1750 337 1800 335 Q1850 333 1900 335 L1920 335" dur="8s" repeatCount="indefinite" />
            </path>
            <path d="M0 355 Q60 357 120 355 Q180 353 240 355 Q300 357 360 355 Q420 353 480 355 Q540 357 600 355 Q660 353 720 355 Q780 357 840 355 Q900 353 960 355 Q1020 357 1080 355 Q1140 353 1200 355 Q1260 357 1320 355 Q1380 353 1440 355 Q1500 357 1560 355 Q1620 353 1680 355 Q1740 357 1800 355 Q1860 353 1920 355">
              <animate attributeName="d" values="M0 355 Q60 357 120 355 Q180 353 240 355 Q300 357 360 355 Q420 353 480 355 Q540 357 600 355 Q660 353 720 355 Q780 357 840 355 Q900 353 960 355 Q1020 357 1080 355 Q1140 353 1200 355 Q1260 357 1320 355 Q1380 353 1440 355 Q1500 357 1560 355 Q1620 353 1680 355 Q1740 357 1800 355 Q1860 353 1920 355;M0 355 Q60 353 120 355 Q180 357 240 355 Q300 353 360 355 Q420 357 480 355 Q540 353 600 355 Q660 357 720 355 Q780 353 840 355 Q900 357 960 355 Q1020 353 1080 355 Q1140 357 1200 355 Q1260 353 1320 355 Q1380 357 1440 355 Q1500 353 1560 355 Q1620 357 1680 355 Q1740 353 1800 355 Q1860 357 1920 355;M0 355 Q60 357 120 355 Q180 353 240 355 Q300 357 360 355 Q420 353 480 355 Q540 357 600 355 Q660 353 720 355 Q780 357 840 355 Q900 353 960 355 Q1020 357 1080 355 Q1140 353 1200 355 Q1260 357 1320 355 Q1380 353 1440 355 Q1500 357 1560 355 Q1620 353 1680 355 Q1740 357 1800 355 Q1860 353 1920 355" dur="10s" repeatCount="indefinite" />
            </path>
          </g>

          {/* River bank / Quai */}
          <rect x="0" y="375" width="1920" height="12" fill={sceneColors.riverBank} />

          {/* NEAR LAYER - Street level buildings */}
          <path
            fill="url(#nearGrad)"
            d="M0 500 L0 395
               L40 395 L40 385 L48 378 L60 370 L72 378 L80 385 L80 395
               L130 395 L130 388 L140 380 L150 388 L150 395
               L200 395 L200 385 L210 375 L220 385 L220 395
               L280 395 L280 390 L290 382 L300 390 L300 395
               L360 395 L360 385 L372 375 L384 385 L384 395
               L450 395 L450 388 L462 378 L474 388 L474 395
               L540 395 L540 390 L550 382 L560 390 L560 395
               L630 395 L630 385 L642 375 L654 385 L654 395
               L720 395 L720 388 L732 378 L744 388 L744 395
               L820 395 L820 390 L830 382 L840 390 L840 395
               L910 395 L910 385 L922 375 L934 385 L934 395
               L1010 395 L1010 388 L1022 378 L1034 388 L1034 395
               L1100 395 L1100 390 L1110 382 L1120 390 L1120 395
               L1200 395 L1200 385 L1212 375 L1224 385 L1224 395
               L1300 395 L1300 388 L1312 378 L1324 388 L1324 395
               L1400 395 L1400 390 L1410 382 L1420 390 L1420 395
               L1500 395 L1500 385 L1512 375 L1524 385 L1524 395
               L1600 395 L1600 388 L1612 378 L1624 388 L1624 395
               L1700 395 L1700 390 L1710 382 L1720 390 L1720 395
               L1800 395 L1800 385 L1812 375 L1824 385 L1824 395
               L1920 395 L1920 500 Z"
          />

          {/* Street level details - doors, awnings */}
          <g fill={sceneColors.street}>
            {[60, 150, 300, 462, 642, 922, 1022, 1212, 1512, 1812].map((x, i) => (
              <rect key={`door-${i}`} x={x - 4} y={388} width="8" height="12" opacity="0.6" />
            ))}
          </g>

          {/* Street trees in foreground */}
          <g fill={sceneColors.trees}>
            {[100, 250, 420, 600, 780, 970, 1150, 1350, 1550, 1750].map((x, i) => (
              <g key={`street-tree-${i}`}>
                <rect x={x - 2} y={410} width="4" height="15" fill={sceneColors.nearBuildings} />
                <ellipse cx={x} cy={400} rx={14 + (i % 3) * 2} ry={18 + (i % 2) * 3} fill={i % 2 === 0 ? sceneColors.trees : sceneColors.treesLight} />
              </g>
            ))}
          </g>

          {/* STREET */}
          <rect x="0" y="425" width="1920" height="75" fill={sceneColors.street} />

          {/* Cobblestone texture hint */}
          <g fill={sceneColors.nearBuildings} opacity="0.15">
            {Array.from({ length: 40 }).map((_, i) => (
              <rect key={`cobble-${i}`} x={i * 50 + 10} y={435} width="30" height="3" rx="1" />
            ))}
            {Array.from({ length: 40 }).map((_, i) => (
              <rect key={`cobble2-${i}`} x={i * 50 + 25} y={455} width="30" height="3" rx="1" />
            ))}
            {Array.from({ length: 40 }).map((_, i) => (
              <rect key={`cobble3-${i}`} x={i * 50} y={475} width="30" height="3" rx="1" />
            ))}
          </g>

          {/* Window lights */}
          <g fill={sceneColors.windows}>
            {/* Mid layer windows */}
            {[55, 130, 212, 392, 482, 752, 1022, 1292, 1562, 1832].map((x, i) => (
              <rect key={`win-mid-${i}`} x={x} y={248} width="3" height="4" />
            ))}
            {/* Near layer windows */}
            {[50, 145, 285, 455, 635, 915, 1015, 1205, 1505, 1805].map((x, i) => (
              <rect key={`win-near-${i}`} x={x} y={382} width="3" height="4" />
            ))}
            {/* Notre-Dame windows at night */}
            {!timeColors.isDay && (
              <>
                <rect x="808" y="195" width="4" height="5" />
                <rect x="876" y="195" width="4" height="5" />
              </>
            )}
          </g>

          {/* Chimney smoke */}
          <g stroke={sceneColors.farBuildings} strokeWidth="1.5" fill="none" opacity="0.1">
            <path d="M70 235 Q75 225 70 215 Q65 205 70 195">
              <animate attributeName="d" values="M70 235 Q75 225 70 215 Q65 205 70 195;M70 235 Q65 225 70 215 Q75 205 70 195;M70 235 Q75 225 70 215 Q65 205 70 195" dur="12s" repeatCount="indefinite" />
            </path>
            <path d="M515 208 Q520 198 515 188 Q510 178 515 168">
              <animate attributeName="d" values="M515 208 Q520 198 515 188 Q510 178 515 168;M515 208 Q510 198 515 188 Q520 178 515 168;M515 208 Q520 198 515 188 Q510 178 515 168" dur="15s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default React.memo(ParisSkyline);
