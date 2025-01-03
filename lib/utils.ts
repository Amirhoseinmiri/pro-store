import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Convert prisma obj to reg js

export function convertTiPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
