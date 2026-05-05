import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse } from 'react-native-svg';

interface Props { width?: number; height?: number; }

export const TrophyIllustration = ({ width = 180, height = 180 }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 180 180">
    {/* Glow backdrop */}
    <Circle cx={90} cy={88} r={62} fill="#FFB347" opacity={0.12} />

    {/* Left handle */}
    <Path
      d="M 62 50 Q 38 55 38 78 Q 38 101 62 106"
      stroke="#F5A030"
      strokeWidth={11}
      fill="none"
      strokeLinecap="round"
    />

    {/* Right handle */}
    <Path
      d="M 118 50 Q 142 55 142 78 Q 142 101 118 106"
      stroke="#F5A030"
      strokeWidth={11}
      fill="none"
      strokeLinecap="round"
    />

    {/* Cup body */}
    <Path
      d="M 58 34 L 62 108 Q 62 122 90 122 Q 118 122 118 108 L 122 34 Z"
      fill="#FFB347"
    />

    {/* Cup shine */}
    <Path
      d="M 68 40 L 71 100 Q 71 110 80 112"
      stroke="white"
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      opacity={0.35}
    />

    {/* Stem */}
    <Rect x={82} y={120} width={16} height={28} rx={4} fill="#F5A030" />

    {/* Base platform */}
    <Rect x={58} y={146} width={64} height={13} rx={5} fill="#FFB347" />
    <Rect x={54} y={157} width={72} height={9} rx={4} fill="#F5A030" />

    {/* Star top */}
    <Path
      d="M 90 18 L 92.9 26.6 L 102 26.6 L 94.9 31.9 L 97.6 40.6 L 90 35.2 L 82.4 40.6 L 85.1 31.9 L 78 26.6 L 87.1 26.6 Z"
      fill="#FFD700"
    />

    {/* Sparkles */}
    <Circle cx={48}  cy={32} r={4}   fill="#FFD700" opacity={0.7} />
    <Circle cx={132} cy={28} r={3}   fill="#FFD700" opacity={0.6} />
    <Circle cx={44}  cy={90} r={3}   fill="#FFB347" opacity={0.5} />
    <Circle cx={136} cy={92} r={3.5} fill="#FFB347" opacity={0.5} />
    <Circle cx={55}  cy={52} r={2.5} fill="#FFD700" opacity={0.4} />
    <Circle cx={125} cy={55} r={2.5} fill="#FFD700" opacity={0.4} />

    {/* Cup bottom ellipse for 3D depth */}
    <Ellipse cx={90} cy={122} rx={28} ry={6} fill="#F0980A" opacity={0.5} />
  </Svg>
);
