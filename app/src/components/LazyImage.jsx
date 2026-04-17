"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const LazyImage = ({ src, alt, wrapperClassName = "", className = "", sizes = "100vw" }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className={`lazy-image-wrapper${wrapperClassName ? ` ${wrapperClassName}` : ""}`} style={{ position: "relative" }}>
      {!loaded && <div className="lazy-image-skeleton" aria-hidden="true" />}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`lazy-image${loaded ? " lazy-image--loaded" : ""}${className ? ` ${className}` : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
};

export default LazyImage;
