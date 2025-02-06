"use server";

import { CartItem } from "@/types";
import { convertTiPlainObj, formatError, roundToTwo } from "@/lib/utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "../../db/prisma";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
// calculate cart totals

export async function getCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Session cart not found");
  //Testing
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  // convert decimal and return
  return convertTiPlainObj({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundToTwo(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = roundToTwo(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwo(0.15 * itemsPrice),
    totalPrice = roundToTwo(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);
    console.log(item);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      // Add to database
      console.log(newCart);

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // If item does not exist in cart
        // Check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        // Add item to the cart.items
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    // Get cart
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // get product from database

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");

    // Check if item is in cart
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found in cart");
    // check if only one in qty
    if (exist.qty === 1) {
      // remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }
    // update cart in db
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    // Revalidate product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Item removed from cart",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
