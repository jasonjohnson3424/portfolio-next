"use client";
import { useState, useCallback } from "react";
import Image from "next/image";

const LazyImage = ({ src, alt, wrapperClassName = "", className = "", sizes = "100vw" }) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className={`lazy-image-wrapper${wrapperClassName ? ` ${wrapperClassName}` : ""}`} style={{ position: "relative" }}>
      {!loaded && <div className="lazy-image-skeleton" aria-hidden="true" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        className={`lazy-image${loaded ? " lazy-image--loaded" : ""}${className ? ` ${className}` : ""}`}
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </div>
  );
};

export default LazyImage;
