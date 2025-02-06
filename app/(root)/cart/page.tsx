import React from "react";
import CartTable from "./cart-table";
import { getCart } from "../../../lib/actions/cart.actions";

export const metadata = {
  title: "Shopping Cart",
};
const CartPage = async () => {
  const cart = await getCart();
  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
};

export default CartPage;
