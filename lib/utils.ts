import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Convert prisma obj to reg js

export function convertTiPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number Decimal places
/**
 * Formats a number to ensure it has at least two decimal places.
 *
 * @param num - The number to format.
 * @returns The formatted number as a string. If the number has no decimal part, it returns the integer part.
 *          If the number has a decimal part, it ensures the decimal part has at least two digits.
 */
export function formatNumberWithDecimal(num: number) {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}
