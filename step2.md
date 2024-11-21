## Step 2 - Navigation
Let's make our first component.
We first want to add some navigation for our users.
In your project directory, create a `ui` directory, here we will store our UI-components, and create a `navigation.tsx` file.
```shell
mkdir -p components
touch components/navigation.tsx
```

### Creating a component
In this file we will create the `navigation component`.
First we need to define an exported function for React to find. We can choose our own name.
This function needs to return some form of `html`*. Let's make it a `<nav>` with our title in it.
Why use a `<nav>`? This tells browsers that it is a navigation element, which is useful for accessibility features.
```tsx
export function Navigation() {
  return (
    <nav>
      ING Webshop
    </nav>
  )
}
```
\* More accurately, it needs to return a React element. Typing some HTML will be recognized as a React element.

### Adding the component
We can now use this component anywhere in our project. As it is reusable, we could add it to every single page of our project.
However, if we want it on every page, it would be very inefficient to have to add that on every page ourselves.
In addition, our webpage would then also have to render the navigation item again for every page, which would be very inefficient.
The `layout.tsx` page is perfect for components that we want to keep between pages. The layout is rendered once, and stays there when navigating between pages.
Let's add our `Navigation` component here.

In the `app/layout.tsx` file you will find a `{children}` variable. This is where child pages of the layout will be rendered.
In other words, every page that uses this layout will be rendered in this spot inside the layout. Let's add our `Navigation` component above it.
Also put the `{children}` inside of a `<div>` with `classname="mt-16 w-full justify-items-center"`
```tsx
...
<html lang="en">
  <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  >
      <Navigation/>
      <div className="mt-16 w-full justify-items-center">
        {children}
      </div>
  </body>
</html>
...
```
- `mt-16` adds some space between the child pages and the top of the screen
- `w-full` & `justify-items-center` cause the child page to be visible in the middle of the screen.

The navigation bar will now be visible in the preview in the browser.

### Styling the component
Also add some styling to classname to make the navigations content display side by side and give it a border and background color.
- `bg-background` tells tailwind that the background 'bg' needs to have the color 'background' (which is white)
- `border-b` makes sure there is a border line at the bottom.
- `flex`, `flex-row` & `items-center` make sure the content of the navigation bar are displayed in a row and in the middle of the height of the bar.
- `fixed`, `top-0`, `z-10` & `w-full` make sure the bar is always displayed at the top of the screen taking up the full width of the page and in front of any content.
```tsx
export function Navigation() {
  return (
    <nav className='fixed top-0 z-10 w-full border-b flex flex-row items-center bg-background'>
      ING Webshop
    </nav>
  )
}
```
We can also add a logo to make it prettier. We'll use the Next.js Image component for that.
This component looks in the `/public` directory. Add the `logo.png` to the `/public` directory to use it.
Our navigation component now looks like this:

```tsx
import Image from "next/image";

export function Navigation() {
  return (
    <nav className="fixed top-0 z-10 w-full border-b flex flex-row items-center bg-background">
      <Image
        src="/logo.png"
        alt="logo"
        width="50"
        height="50"
      />
      ING Webshop
    </nav>
  )
}
```

### Navigation links
The only thing missing is actual navigation links. Let's add those now.
We don't want to just put hyperlinks on the page, as this would request a full rerender of the page from our webserver.
Instead, we want Next.js to handle the routing by using the `Link` component.
Let's add a new `<div>` element to our navigation bar and add a `Home`, `Shop` & `Cart` item.
We can put some text inside which will be displayed. and the link to the page to the page the button should navigate to must be put in `href` (this can be a relative link but could result in unintended results).

```tsx
import 'next/link';
...
<nav>
  ...
    ING Webshop
  
  <div>
    <Link href="/">
      Home
    </Link>
    <Link href="/shop">
      Shop
    </Link>
    <Link href="/cart">
      Cart
    </Link>
  </div>
  
</nav>
...
```
You'll see that the links are added, but don't look very nice in the browser.
We can add `className="p-4 space-x-2"` to add some spacing.
- `p-4` adds 4 pixels of space between the `<div>` and neighbouring elements (for instance the webshop title).
- `space-x-2` adds 2 pixels of space in the x-direction (to the sides) of all elements inside the `<div>`.

The navigation element might now look like this:

```tsx
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="fixed top-0 z-10 w-full border-b flex flex-row items-center bg-background">
      
      <Image
        src="/logo.png"
        alt="logo"
        width="50"
        height="50"
      />
      
      ING Webshop
      
      <div className="p-4 space-x-2" >
        <Link href="/">
          Home
        </Link>
        <Link href="/shop">
          Shop
        </Link>
        <Link href="/cart">
          Cart
        </Link>
      </div>
      
    </nav>
  )
}
```

Try pressing the navigation buttons we added. Two of them point to pages that don't exist yet.
But rather than showing a not found error on the whole page, Next.js will render the default `404-error` page inside of the layout with our navigation bar,
making sure the user can still use it, in case of a missing page.

> We could add our own `not-found.tsx` page to the app directory if we want to display a custom `404-error`.
> Likewise, we can add a `error.tsx` page in case any other error occurs.
> Both are rendered inside the layout, making sure the navigation bar and any other element in the layout is still usable by the user.