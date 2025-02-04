import {Product} from "../../components/product";

export type Product = {
  id: number;
  name: string;
  price: number;
  desc: string;
}

export default async function Shop() {
  const response = await fetch("http://127.0.0.1:8000/api/products")
  if (!response.ok) {
    return(<div>No Products Found</div>)
  }

  const products = (await response.json()) as Product[];

  return(
    <div className="grid grid-cols-3 gap-2">
      {products.map(product => {
        return(
          <Product
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
          />
        )
      })}
    </div>
  )
}