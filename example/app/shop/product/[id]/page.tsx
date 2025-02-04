import {Product} from "@/app/shop/page";
import ProductDetail from "@/components/productDetail";
import SaleDetail from "@/components/saleDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const id = (await params).id
  const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`)
  if (!response.ok) {
    return productNotFound()
  }
  const product: Product = await response.json()

  return(
    <div className="w-full grid grid-cols-3 mx-4 p-8">
      <div className="col-span-2 border p-2">
        <ProductDetail product={product}/>
      </div>
      <div className="border p-2">
        <SaleDetail product={product}/>
      </div>
    </div>
  )
}

function productNotFound() {
  return (
    <div>Product Not Found</div>
  )
}