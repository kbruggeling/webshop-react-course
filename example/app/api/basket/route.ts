import {NextRequest} from "next/server";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  let res = await fetch(`http://127.0.0.1:8000/api/basket`)
  if (!res.ok) {
    return new Response("Unable to create basket", {
      status: res.status,
      statusText: res.statusText
    })
  }
  res = await fetch(`http://127.0.0.1:8000/api/basket/add?product_id=${id}`, {
    method: "POST"
  })
  if (!res.ok) {
    return new Response("Unable to add product basket", {
      status: res.status,
      statusText: res.statusText
    })
  }
  res = await fetch(`http://127.0.0.1:8000/api/basket`)
  if (!res.ok) {
    return new Response("Unable to retrieve updated basket", {
      status: res.status,
      statusText: res.statusText
    })
  }
  const data = await res.json()
  return Response.json(data)
}