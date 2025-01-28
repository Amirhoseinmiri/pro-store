import React from "react";
import { cn } from "../../lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) => {
  const stringValue = Number(value)?.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
