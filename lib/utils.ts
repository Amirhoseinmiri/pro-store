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

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

// round number to 2 decimal places
export function roundToTwo(num: number | string) {
  if (typeof num === "number") {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  } else if (typeof num === "string") {
    return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Invalid number");
  }
}

const CURRENCY_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

// Format currency using formatter
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMAT.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMAT.format(Number(amount));
  } else {
    return "NaN";
  }
}
