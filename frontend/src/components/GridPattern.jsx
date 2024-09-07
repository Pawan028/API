import React from 'react';

function GridPattern({
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  strokeDasharray = 0,
  squares,
  className = '',
}) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`fixed inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M0 ${height}V0H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
            stroke="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {squares && (
        <g>
          {squares.map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
              fill="currentColor"
            />
          ))}
        </g>
      )}
    </svg>
  );
}

export default GridPattern;
