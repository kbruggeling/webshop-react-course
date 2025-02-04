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