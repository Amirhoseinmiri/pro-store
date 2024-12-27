import ProductList from "@/components/product/product-list";
import sampleData from "@/db/sample-data";

export default async function Home() {
  return (
    <div className="">
      <ProductList data={sampleData.products} title="newest collection" />
    </div>
  );
}
