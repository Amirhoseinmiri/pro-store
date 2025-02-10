import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a exactly 2 decimal places"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// schema for sign in users

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(4, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// cart schema

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(3, "Image must be at least 3 characters"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  taxPrice: currency,
  shippingPrice: currency,
  totalPrice: currency,
  sessionCartId: z
    .string()
    .min(1, "Session Cart ID must be at least 3 characters"),
  userId: z.string().optional().nullable(),
});

// schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
