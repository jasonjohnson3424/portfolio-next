"use client";
import { useState } from "react";

/**
 * Renders an image with a shimmer skeleton placeholder while loading.
 * Accepts all standard <img> props plus an optional `wrapperClassName`.
 */
const LazyImage = ({ src, alt, wrapperClassName = "", className = "", ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`lazy-image-wrapper${wrapperClassName ? ` ${wrapperClassName}` : ""}`}>
      {!loaded && <div className="lazy-image-skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`lazy-image${loaded ? " lazy-image--loaded" : ""}${className ? ` ${className}` : ""}`}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </div>
  );
};

export default LazyImage;
