"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * Renders a next/image with a shimmer skeleton placeholder while loading.
 * Parent must have position: relative and defined dimensions for fill mode.
 */
const LazyImage = ({ src, alt, wrapperClassName = "", className = "", sizes = "100vw" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`lazy-image-wrapper${wrapperClassName ? ` ${wrapperClassName}` : ""}`} style={{ position: "relative" }}>
      {!loaded && <div className="lazy-image-skeleton" aria-hidden="true" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`lazy-image${loaded ? " lazy-image--loaded" : ""}${className ? ` ${className}` : ""}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default LazyImage;
