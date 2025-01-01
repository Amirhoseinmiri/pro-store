"use server";
import { PrismaClient } from "@prisma/client";
import { convertTiPlainObj } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
// Get Latest Products

export const getLatestProduct = async () => {
  const prisma = new PrismaClient();
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertTiPlainObj(data);
};
