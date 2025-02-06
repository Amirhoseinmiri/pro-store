import React from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product.action";
import ProductPrice from "@/components/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductImages from "@/components/product/product-images";
import AddToCart from "@/components/product/add-to-cart";
import { getCart } from "@/lib/actions/cart.actions";
const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const product = await getProductById(slug);
  const cart = await getCart();
  if (!product) notFound();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            {/* Image comp */}
            <ProductImages images={product.images} />
          </div>
          {/* Deatails column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} Reviews
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={product.price}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={product.price} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant={"outline"}>In Stock</Badge>
                  ) : (
                    <Badge variant={"destructive"}>Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        image: product.images[0],
                        price: product.price,
                        qty: 1,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
