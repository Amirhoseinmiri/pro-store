import ProductList from "@/components/product/product-list";
import { getLatestProduct } from "@/lib/actions/product.action";

export default async function Home() {
  const latestProduct = await getLatestProduct();
  return (
    <div className="">
      <ProductList data={latestProduct} title="newest collection" />
    </div>
  );
}
