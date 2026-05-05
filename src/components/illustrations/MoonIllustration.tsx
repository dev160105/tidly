import React from 'react';
import Svg, {
  Circle, Rect, Path, Ellipse, G,
} from 'react-native-svg';

interface Props { width?: number; height?: number; }

export const MoonIllustration = ({ width = 280, height = 220 }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 280 220">
    {/* Night sky background */}
    <Rect x={0} y={0} width={280} height={220} rx={24} fill="#1A1F2E" />

    {/* Stars */}
    <Circle cx={30}  cy={22} r={2.5} fill="white" opacity={0.8} />
    <Circle cx={70}  cy={12} r={2}   fill="white" opacity={0.6} />
    <Circle cx={110} cy={28} r={2}   fill="white" opacity={0.7} />
    <Circle cx={155} cy={18} r={1.5} fill="white" opacity={0.5} />
    <Circle cx={185} cy={30} r={2}   fill="white" opacity={0.6} />
    <Circle cx={50}  cy={55} r={1.5} fill="white" opacity={0.4} />
    <Circle cx={260} cy={20} r={2}   fill="white" opacity={0.6} />
    <Circle cx={248} cy={80} r={1.5} fill="white" opacity={0.4} />

    {/* Moonlight glow */}
    <Circle cx={228} cy={48} r={44} fill="#2A3050" opacity={0.6} />

    {/* Moon (crescent via overlay) */}
    <Circle cx={228} cy={48} r={30} fill="#FFF5CC" />
    <Circle cx={215} cy={38} r={26} fill="#1A1F2E" />

    {/* Moon surface details */}
    <Circle cx={234} cy={38} r={4} fill="#E8D87A" opacity={0.3} />
    <Circle cx={240} cy={54} r={3} fill="#E8D87A" opacity={0.2} />

    {/* Rainbow arch (subtle dark version) */}
    <Path
      d="M 15 158 A 125 90 0 0 1 265 158"
      stroke="#4A3060"
      strokeWidth={9}
      fill="none"
      strokeLinecap="round"
      opacity={0.5}
    />

    {/* House body */}
    <Rect x={75} y={100} width={130} height={80} rx={6} fill="#243347" />

    {/* Roof */}
    <Path d="M 64 101 L 140 52 L 216 101 Z" fill="#1C2A3A" />

    {/* Left window (glowing) */}
    <Rect x={90} y={113} width={30} height={24} rx={5} fill="#2A4A6A" />
    <Rect x={90} y={113} width={30} height={24} rx={5} fill="#FFB347" opacity={0.15} />
    <Line x1={105} y1={113} x2={105} y2={137} stroke="#1A3A5A" strokeWidth={1} />
    <Line x1={90}  y1={125} x2={120} y2={125} stroke="#1A3A5A" strokeWidth={1} />

    {/* Right window (glowing) */}
    <Rect x={160} y={113} width={30} height={24} rx={5} fill="#2A4A6A" />
    <Rect x={160} y={113} width={30} height={24} rx={5} fill="#FFB347" opacity={0.15} />
    <Line x1={175} y1={113} x2={175} y2={137} stroke="#1A3A5A" strokeWidth={1} />
    <Line x1={160} y1={125} x2={190} y2={125} stroke="#1A3A5A" strokeWidth={1} />

    {/* Door */}
    <Rect x={118} y={134} width={44} height={46} rx={5} fill="#1C2A3A" />
    <Circle cx={156} cy={158} r={3} fill="#243347" />

    {/* Purple steps */}
    <Rect x={112} y={178} width={56} height={9} rx={4} fill="#5B4A8A" />
    <Rect x={102} y={187} width={76} height={9} rx={4} fill="#5B4A8A" />
    <Rect x={92}  y={196} width={96} height={9} rx={4} fill="#5B4A8A" />

    {/* Potted plant (dark mode) */}
    <Rect x={18} y={186} width={40} height={28} rx={5} fill="#2A3A2A" />
    <Rect x={14} y={181} width={48} height={9} rx={4} fill="#344A34" />

    {/* Stem */}
    <Path
      d="M 38 180 Q 38 168 38 158"
      stroke="#2A6A50"
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />

    {/* Leaves */}
    <G transform="rotate(-35, 26, 165)">
      <Ellipse cx={26} cy={165} rx={14} ry={8} fill="#2A6A50" />
    </G>
    <G transform="rotate(35, 50, 161)">
      <Ellipse cx={50} cy={161} rx={14} ry={8} fill="#236050" />
    </G>
    <G transform="rotate(0, 38, 150)">
      <Ellipse cx={38} cy={150} rx={10} ry={7} fill="#2A6A50" />
    </G>
  </Svg>
);
