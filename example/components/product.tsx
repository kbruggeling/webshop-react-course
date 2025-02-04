import Link from "next/link";

export function Product({
  id,
  name,
  price,
}:{
  id: number
  name: string
  price: number
}) {
  return (
    <Link href={`/shop/product/${id}`}>
      <div className="max-w-64 border border-foreground m-2">
        <img src="https://picsum.photos/300/300" alt={name} />
        <div className="p-2 space-y-2">
          <p className="text-2xl text-blue-500 truncate">{name}</p>
          <p className="italic text-gray-500">€{price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
}