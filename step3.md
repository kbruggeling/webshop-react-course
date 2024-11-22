## Step 3 - Pages

Now that the navigation bar is working, let's populate the `Shop` page.
In `Next.js` routing is taken care of based on the contents of the `app` directory.
Every subdirectory represents a subpage, and each sub-subdirectory represents a sub-subpage, etc.
So to make add a route `www.webshop.com/shop/item` we would need to add `app/shop/item`
When navigating to a page, Next.js tries to serve any `layout.tsx` and/or `page.tsx` inside.
Any `layout.tsx` page is served in order as well.

So, let's say we have this file structure:
```
/app
├── layout.tsx
├── page.tsx
└── shop
    ├── layout.tsx
    ├── page.tsx
    └── /item
        ├── layout.tsx
        └── page.tsx
```

>If we go to `www.webshop.com`, Next.js will try to render `app/page.tsx` inside of `app/layout.tsx`
>
>`www.webshop.com/shop` will render `app/shop/page.tsx` inside `app/shop/layout.tsx` inside `app/layout.tsx`.
> 
> `www.webshop.com/shop/item` will render `app/shop/item/page.tsx` in `app/shop/item/layout.tsx` in `app/shop/layout.tsx` in `app/layout.tsx`

Any directory can have any number of subdirectories, all rendered inside each parent layout.

### Creating the Shop page

To make the shop page, all we need to do is add a `shop` directory inside of `app` and create a valid `page.tsx` page in there.

```shell
mkdir app/shop
touch app/shop/page.tsx
```

The page needs an exported default function that returns a React element as a minimum.
You can name it as you'd like, I'd suggest just the name of the page.
Add a `<div>` element so react recognizes it as a React element, and add some text so we can see it working in the browser.
```tsx
export default function Shop() {
  return(
    <div>
      shop
    </div>
  )
}
```
Navigating to `Shop` should no longer give a 404-error.


### Create a Product component

We'd want to populate this shop page with a list of products.
As we want each product to be displayed in the same way, making a component for it makes sense.
In `/components`, make a file `product.tsx`

```shell
touch components/product.tsx
```

As with the Navigation bar, the file needs to contain an exported function that return a React Element.
Let's add a `<div>` with the following css classes `"border-2 border-foreground"` to give it an outline.
Each product, we want to display a title, a price and maybe a description.

```tsx
export function Product() {
  return (
    <div className="border-2 border-foreground">
      <p>name</p>
      <p>price</p>
      <p>description</p>
    </div>
  )
}
```

Let's add a few to our shop page, as well as some space between and beside them.
```tsx
import {Product} from "@/components/product";

export default function Shop() {
  return(
    <div className="space-y-4 p-4">
      <Product/>
      <Product/>
      <Product/>
    </div>
  )
}
```
- `space-y-4` adds 4 pixels of space between items inside this `<div>`
- `p-4` adds 4 pixels of padding, which means 4 pixels of space is added between items and the border of the `<div>`

### Use properties
Now we can also make a component accept properties, which is perfect for our `Product` component.
We can give it a product name, price and description when creating.

A component function can accept a json object containing its properties.
In other words, we can define a json object containing a name, price and description as we like.
In `/components/product.tsx` add a parameter to the Product() function in this form:

`{properties} : {properties: types}`
in our case this looks like this:

`{name, price, description} : {name: string, price: number, description: string}`

```tsx
export function Product({
  name,
  price,
  description
}:{
  name: string
  price: number
  description: string
}) {
  return (...)
}
```

We can then replace the product details with the properties given when creating the product.
Putting stuff between brackets makes sure React will not interpret it as html:

```tsx
<div className="border-2 border-foreground">
  <p>{name}</p>
  <p>{price}</p>
  <p>{description}</p>
</div>
```

Our final product component will look like this:

```tsx
export function Product({
  name,
  price,
  description
}:{
  name: string
  price: number
  description: string
}) {
  return (
    <div className="border-2 border-foreground">
      <p>{name}</p>
      <p>{price}</p>
      <p>{description}</p>
    </div>
  )
}
```

Our `/app/shop/page.tsx` will now complain that the created products miss required properties.
If we wanted to make the properties optional, we should have added a `?` in their types:
```tsx
{
  name,
  price,
  description
}:{
  name?: string
  price?: number
  description?: string
}
```

Let's add the properties when creating the instances of the Product in `/app/shop/page.tsx`:


```tsx
<div className="space-y-4 p-4">
  <Product
    name={"laptop"}
    price={999.99}
    description={"this is a laptop"}
  />
  <Product
    name={"mouse"}
    price={19.99}
    description={"this is a mouse"}
  />
  <Product
    name={"keyboard"}
    price={29.99}
  />
</div>
```

### Dynamic product list

We probably don't want to hardcode our product list.
The plan is to get a list of products from our backend API.
As an example, we'll use https://fakestoreapi.com/products, which gives us a json response with 20 products.

We'll first have to define what we expect our product to look like by defining a new Type.
The API returns items with a title, a price and a description (and some other stuff we'll not use for now), so let's add those properties to the type:

```tsx
export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
}
```

We'll now fetch the data from the API by making a fetch request.
`await` makes sure we wait for the response.
We also check if the response has any errors and throws an error if so.
If everything is ok, we can convert the response to a json object and interpret it as a list of the Product type we just defined:

```tsx
const response = await fetch("https://fakestoreapi.com/products")
if (!response.ok) {
  throw new Error('Unable to fetch product list')
}

const products = (await response.json()) as Product[];
```

We need this data in our Shop page, so our `app/shop/page.tsx` file.
Add it to the `Shop` function. Now that we've added an `await` function, we need to make the function asynchronous:
```tsx
...
export default async function Shop() {
  const response = await fetch("https://fakestoreapi.com/products")
  if (!response.ok) {
    throw new Error('Unable to fetch product list')
  }

  const products = (await response.json()) as Product[];

  return(
...
```

We can then go over the list and create an instance of our Product component for each item.
(It may  have been a good idea to not give the same name to the Type and the Component to prevent confusion, but the language knows what we mean in this instance).
The `map()` function does exactly this. We can give a variable name to every item in the list, and then define what map should return for each item in the list.
```tsx
<some_list>.map(<some_item_name> => {return(<some_html>)}
```
In our case we want to return some html, namely an instance of our `Product` component with the properties set from the item on the list.

```tsx
export default function Shop() {
  return(
    <div className="space-y-4 p-4">
      {products.map(product => {
        return(
          <Product
            key={product.id}
            name={product.title}
            price={product.price}
            description={product.description}
          />
        )
      })}
    </div>
  )
}
```

`map()` will now go over each item in the list and assign it to the var `product`.
We then perform the function after the `=>` on each `product`.
Anything this function returns will be rendered by react, so it will now render a number of instances of the `Product` component.

Our final `app/shop/page.tsx` will look like this:

```tsx
import {Product} from "@/components/product";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
}

export default async function Shop() {
  const response = await fetch("https://fakestoreapi.com/products")
  if (!response.ok) {
    throw new Error('Unable to fetch product list')
  }

  const products = (await response.json()) as Product[];

  return(
    <div className="space-y-4 p-4">
      {products.map(product => {
        return(
          <Product
            key={product.id}
            name={product.title}
            price={product.price}
            description={product.description}
          />
        )
      })}
    </div>
  )
}
```


### Creating a loading screen

In the last step we've added a fetch request to an API and await it.
If the API call takes a long time, it might look like nothing is happening on the users end as the `app/shop/page.tsx` is waiting to load.
Our rendered components, like the Navigation bar, will still be usable during this time, but it might be nice to show the user that stuff is happening in the background.

While pages are loading, Next.js will look for the closest `loading.tsx` and display that in the meantime (similarly to how the `error.tsx` & `not-found.tsx` work).
We can add a `loading.tsx` one in the shop directory. You can make it look like anything, it can be as intricate as you want.
Or just a simple indication that something is loading:

```tsx
export default function Loading() {
  return (
    <div>Loading...</div>
  )
}
```

Depending on the internet speed, you might see the loading screen when navigating to the shop.
You can make it more clear by adding a `await wait(5000)` before loading the page:

```tsx
export default async function Shop() {
  const response = await fetch("https://fakestoreapi.com/products")
  if (!response.ok) {
    throw new Error('Unable to fetch product list')
  }
  await wait(5000)

  const products = (await response.json()) as Product[];
  return(
    <div className="space-y-4 p-4">
      {products.map(product => {
...
```