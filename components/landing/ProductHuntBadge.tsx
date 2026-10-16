import React from 'react';

export function ProductHuntBadge({
  className = '',
  theme = 'dark',
}: {
  className?: string;
  theme?: 'light' | 'dark';
}) {
  const src = `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1115541&theme=${theme}`;

  return (
    <img
      src={src}
      alt="Arcoh on Product Hunt"
      width={250}
      height={54}
      className={`inline-block h-auto w-[200px] max-w-full opacity-90 sm:w-[250px] ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
