export default function Skeleton({ width, height, borderRadius = 6, circle = false, className = '', style = {}, count = 1, gap = 8, as: Element = 'div' }) {
  return Array.from({ length: count }, (_, index) => (
    <Element key={index} className={`skeleton-bone ${className}`} style={{
      width: circle ? height : width, height, borderRadius: circle ? '50%' : borderRadius,
      ...(index > 0 ? { marginTop: gap } : {}), ...style,
    }}><Element className="skeleton-shimmer" style={{ animationDelay: `${index * .05}s` }} /></Element>
  ));
}
