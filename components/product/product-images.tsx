"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "../../lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-2">
        {images.map((image, i) => (
          <div
            key={image}
            onClick={() => setCurrent(i)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === i && "border-orange-500"
            )}
          >
            <Image src={image} alt="images product" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
