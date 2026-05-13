type Props = {
  data: number[];
  color?: string;
  fill?: string;
};

export function Sparkline({
  data,
  color = "var(--text-mint)",
  fill = "rgba(10,122,79,.10)",
}: Props) {
  const w = 200, h = 44, pad = 4;
  if (data.length === 0) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => [pad + i * stepX, h - pad - ((v - min) / range) * (h - pad * 2)] as const);
  const path = pts
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1))
    .join(" ");
  const last = pts[pts.length - 1];
  const first = pts[0];
  const fillPath = path + ` L${last[0].toFixed(1)},${h} L${first[0].toFixed(1)},${h} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={fillPath} fill={fill} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 2.6 : 0} fill={color} />
      ))}
    </svg>
  );
}
