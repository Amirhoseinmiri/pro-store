"use server";
import { prisma } from "@/db/prisma";
import { convertTiPlainObj } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
// Get Latest Products

export const getLatestProduct = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertTiPlainObj(data);
};
// Get single product
export const getProductById = async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
  });
};
