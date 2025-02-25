import { Metadata } from "next";
import React from "react";
import { getCart } from "@/lib/actions/cart.actions";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.action";
import ShippingAddressForm from "./shipping-address-form";
import type { ShippingAddress } from "@/types";
import CheckOutSteps from "@/components/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
  description: "Shipping Address",
};
const ShippingAddress = async () => {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) redirect("/cart");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("no user Id");
  const user = await getUserById(userId);

  return (
    <div>
      <CheckOutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </div>
  );
};

export default ShippingAddress;
