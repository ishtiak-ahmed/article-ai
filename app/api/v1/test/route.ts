// app/api/test/route.ts

export async function GET() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await res.json()

    return Response.json({ success: true, data })
  } catch (error) {
    console.log(error, 'error')
    return Response.json(
      { success: false, message: 'Error fetching data' },
      { status: 500 }
    )
  }
}
