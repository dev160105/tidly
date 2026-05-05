import React from 'react';
import Svg, {
  Circle, Rect, Path, Ellipse, Line, G,
} from 'react-native-svg';

interface Props { width?: number; height?: number; }

export const SunIllustration = ({ width = 280, height = 220 }: Props) => {
  const sunCx = 228;
  const sunCy = 48;
  const sunR = 30;

  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <Svg width={width} height={height} viewBox="0 0 280 220">
      {/* Rainbow arch */}
      <Path
        d="M 15 158 A 125 90 0 0 1 265 158"
        stroke="#FF6B6B"
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
        opacity={0.65}
      />

      {/* House body */}
      <Rect x={75} y={100} width={130} height={80} rx={6} fill="#3ECFA0" />

      {/* Roof */}
      <Path d="M 64 101 L 140 52 L 216 101 Z" fill="#28B892" />

      {/* Roof ridge cap */}
      <Path
        d="M 64 101 L 140 52 L 216 101"
        stroke="#20A07C"
        strokeWidth={3}
        fill="none"
        strokeLinejoin="round"
      />

      {/* Left window */}
      <Rect x={90} y={113} width={30} height={24} rx={5} fill="white" opacity={0.92} />
      <Line x1={105} y1={113} x2={105} y2={137} stroke="#E0E0E0" strokeWidth={1} />
      <Line x1={90} y1={125} x2={120} y2={125} stroke="#E0E0E0" strokeWidth={1} />

      {/* Right window */}
      <Rect x={160} y={113} width={30} height={24} rx={5} fill="white" opacity={0.92} />
      <Line x1={175} y1={113} x2={175} y2={137} stroke="#E0E0E0" strokeWidth={1} />
      <Line x1={160} y1={125} x2={190} y2={125} stroke="#E0E0E0" strokeWidth={1} />

      {/* Door */}
      <Rect x={118} y={134} width={44} height={46} rx={5} fill="#28B892" />
      <Circle cx={156} cy={158} r={3} fill="#1A9870" />

      {/* Purple steps */}
      <Rect x={112} y={178} width={56} height={9} rx={4} fill="#A78BFA" />
      <Rect x={102} y={187} width={76} height={9} rx={4} fill="#A78BFA" />
      <Rect x={92}  y={196} width={96} height={9} rx={4} fill="#A78BFA" />

      {/* Sun rays */}
      {rays.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = sunCx + (sunR + 4) * Math.cos(rad);
        const y1 = sunCy + (sunR + 4) * Math.sin(rad);
        const x2 = sunCx + (sunR + 16) * Math.cos(rad);
        const y2 = sunCy + (sunR + 16) * Math.sin(rad);
        return (
          <Line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#FFB347"
            strokeWidth={5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Sun body */}
      <Circle cx={sunCx} cy={sunCy} r={sunR} fill="#FFB347" />

      {/* Sun face */}
      <Circle cx={220} cy={43} r={3.5} fill="#CC8800" opacity={0.5} />
      <Circle cx={236} cy={43} r={3.5} fill="#CC8800" opacity={0.5} />
      <Path
        d="M 218 53 Q 228 62 238 53"
        stroke="#CC8800"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* Pot */}
      <Rect x={18} y={186} width={40} height={28} rx={5} fill="#F5A030" />
      <Rect x={14} y={181} width={48} height={9} rx={4} fill="#FFB347" />

      {/* Stem */}
      <Path
        d="M 38 180 Q 38 168 38 158"
        stroke="#28B892"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaves */}
      <G transform="rotate(-35, 26, 165)">
        <Ellipse cx={26} cy={165} rx={14} ry={8} fill="#3ECFA0" />
      </G>
      <G transform="rotate(35, 50, 161)">
        <Ellipse cx={50} cy={161} rx={14} ry={8} fill="#2BB88A" />
      </G>
      <G transform="rotate(0, 38, 150)">
        <Ellipse cx={38} cy={150} rx={10} ry={7} fill="#3ECFA0" />
      </G>
    </Svg>
  );
};
