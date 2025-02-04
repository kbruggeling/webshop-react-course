"use client"
import {Product} from "@/app/shop/page";

export default function SaleDetail({
 product
}: {
  product:Product
}) {
  async function addToCart() {
    const response = await fetch(`/api/basket?id=${encodeURIComponent(product.id)}`, {
      method: 'POST',
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const data = await response.json()
    console.log(data)
  }

  return(
    <div>
      <p className="text-2xl">Sale Details</p>
      <p className="text-xl text-blue-500 italic">€{product.price.toFixed(2)}</p>

      <button
        className="p-2 bg-blue-500 rounded"
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  )
}