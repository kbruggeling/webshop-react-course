## Step 3 - API

### Using the Go webshop API
We are going to start use the api we built in the go course.
In our `app/shop/page.tsx` we are fetching a product list from a fake store api.
We will replace it with our go api. Make sure your go webshop is running.
Replace the fetch in `app/shop/page.tsx` by `http://127.0.0.1:8000/api/products` & render an error if the response is not ok:
```tsx
  const response = await fetch("http://127.0.0.1:8000/api/products")
  if (!response.ok) {
    return(<div>No Products Found</div>)
}
```

You will notice that not much is being shown in the shop page.
This is because the data we expect from the api call is incorrect.
We need to update our `Product` interface.

```
Task: Update the Product interface in app/shop/page.tsx for the data the go api provides.
```

### Update `<Product/>`
Our `Product` compoonent is used to show all available products.
Let's make sure our customers can navigate from this list to a detail page of a particular product.
We'll turn our `Product` component into a navigation link.
Go over to product.tsx and wrap it in a `<Link></Link>`.
The link should navigate to a page, unique to a particular product.
But each product will need a similar page, just different details.
Dynamic routes are perfect for this.

#### Product Detail Page & Dynamic Routes
A Dynamic Route is like a variable segment in your url structure. For instance:
```
your-site.com/some-segment/[anything]
```
We want to be able to fill in anything for `[anything]` and it will lead to the same page, just some different data displayed on it.
This is exactly what a dynamic route does.
And all we have to do, is make a directory wrapped in square brackets.
Let's add a `product` directory in our `/app/shop/` and add a '[id]' directory inside of there, so that the result is:
```
/app/shop/product/[id]/
```
Now inside of the `[id]` directory, add a `page.tsx`.
When we go to www.your-site/shop/product/something or www.your-site/shop/product/anything-else, it will lead to this `page.tsx`.

Now let's add a `Page()` in there, and make it async as we will add some "awaits" in a second.

The segment that is filled in in our URL for `[id]` will be passed to this page inside an attribute called `params`.
To retrieve it we will have to get it out of there. This can be done like this:
```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const id = (await params).id;

...
}
```
We can use this `id` to retrieve a single product from our backend.
The backend has an api endpoint `/api/product/:id`, which we can call to retrieve the details of a single product.
We can do that with a `fetch()`.
The backend is running on the same machine so you can use the local ip address to call it and the port the backend is running on.
```
Task: Create a fetch() request to the backend to retrieve a single product.
Check if the response is 'ok' and render something to show if it is not.
```

Now to fill the page when the response is ok, add a `<div>` with a grid & 3 columns and two bordered `<div>` inside.
```tsx
return (
  <div className="w-full grid grid-cols-3 p-8">
    <div className="col-span-2 border">
      <ProductDetail product={product}/>
    </div>
    <div className="border">
      <SaleDetail product={product}/>
    </div>
  </div>
)
```

This will divide the page in two sections, one twice as big as the other.
And inside these sections are two new components that have access to the `product` we get from our backend.
These components still have to be made though.

### components/productDetail.tsx
`
Task: Create a ProductDetail component that accepts a 'product' attribute and renders **name**, **price** & **description** of the product.
you can add a picture to fill things up:
`
```tsx
<img src="https://picsum.photos/900/500" alt={product.name} />
```

### component/saleDetail.tsx & server/client separation
We also need the SaleDetail component.
This component needs to have a button that adds the product to our shopping cart.
Because this needs interaction by our users, it needs to be able to run code on the client side.
Up until now, all code (api calls and data handling) has been occurring on our server side.
Our client side is not aware that api calls are being made as they are made when the pages are rendered on the server side.
For this button to be able to run code, we need to specify that it is a client component.

This is as easy as adding 'use client' to the top of our component page.

Lets create the component and render a button:
```tsx
"use client"
import {Product} from "@/app/shop/page";

export default function SaleDetail({
 product
}: {
  product:Product
}) {

  return (
    <div>
      <p className="text-2xl">Sale Details</p>

      <button
        className="p-2 bg-blue-500 rounded"
      >
        Add to Cart
      </button>
    </div>
  )
}
```
This button will not do anything yet, but we can add an `onClick` attribute that runs a function
```tsx
<button
  className="p-2 bg-blue-500 rounded"
  onClick={addToCart}
>
```
The `addToCart` function needs to do an api call to our backend.
However, as we are now on the client side of things, we don't want to just directly call our backend.
So we will make an intermediate api in our frontend that does the api call to our backend.

### /app/api/cart/route.ts
We can create an api directory with a `cart` endpoint (directory).
In the cart directory, instead of a `page.tsx`, create a `route.ts`, as this is not a normal page.

The API endpoint needs to accept POST requests, which we can do by simple exporting a `POST()` function.
It will make calls to our golang backend so we need it to be async.
And, as it is an API endpoint, it turns the request the API endpoint receives into a parameter which we can name ourselves:
```tsx
export async function POST(req: NextRequest) {
  
}
```
The req parameter contains the request make to the endpoint, including the url.
This means we can put variables in our API call that we can then use, a product id for example.

We can retrieve such variables, which are called `search parameters` by:
```tsx
  const id = req.nextUrl.searchParams.get("id")
  console.log(id)
```
This will search our request url for a variable `id`.
We then log it to check if everything is working

### /components/saleDetail.tsx
We'll make the `addToCart()` function that will do the call to our freshly made api endpoint:
```tsx
async function addToCart() {
  const response = await fetch(`/api/basket?id=${encodeURIComponent(product.id)}`, {
    method: 'POST',
  })
}
```
Then call the function when our button is pressed:
```tsx
<button
  className="p-2 bg-blue-500 rounded"
  onClick={addToCart}
>
```
Pressing the button should now log the product id.

### /app/api/cart/route.ts
Adding a product to our cart entails a few calls to our backend.
We need to make sure a cart/basket exists, then add a product to it, and then maybe check if it is successfully added.
`Task: Add these 3 api calls to the '/app/api/cart/route.ts' POST() function.
Check our backends '/handlers/handler.go' to check the endpoints needed.
Also check if each api calls response is 'ok' before continueing.
Finally return the json response of the last response so our new frontend api call returns something:`
```tsx
const data = await res.json() //assuming your backend api call response is stored in 'res'
return Response.json(data)
```

### /components/saleDetail.tsx
Let's check the response of our new API endpoint in the `addToCart()` function.
Check the response and log its results:
```tsx
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
```
Clicking the button should log the basket json from our backend API.
You can right click the page and press `inspect` to view the console, as it is logged in the client side.
`option+command+i` also opens this tab.
We now have a shop page, with a list of products which, when clicked, navigate to a product detail page with a button to add it to our cart.