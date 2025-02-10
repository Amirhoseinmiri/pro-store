export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = 4;

export const ShippingAddressDeaultValues = {
  fullName: "John Doe",
  streetAddress: "1234 Elm St",
  city: "Springfield",
  postalCode: "12345",
  country: "United States",
  lat: 37.7749,
  lng: -122.4194,
};
