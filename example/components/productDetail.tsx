import {Product} from "@/app/shop/page";

export default function ProductDetail({
  product
}: {
  product:Product
}) {
  return (
    <div>
      <img src="https://picsum.photos/900/500" alt={product.name} />
      <p className="text-3xl">{product.name}</p>
      <p>{product.desc}</p>
    </div>
  )
}