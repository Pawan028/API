import React from 'react';

function DiagonalStripePattern({
  stripeWidth = 10,
  stripeSpacing = 20,
  color1 = "#f0f0f0",
  color2 = "#ffffff",
  className = '',
}) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`fixed inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          width={stripeWidth + stripeSpacing}
          height={stripeWidth + stripeSpacing}
          patternUnits="userSpaceOnUse"
        >
          <rect width={stripeWidth} height={stripeWidth} fill={color1} />
          <rect
            x={stripeWidth}
            y={stripeWidth}
            width={stripeWidth}
            height={stripeWidth}
            fill={color2}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default DiagonalStripePattern;
