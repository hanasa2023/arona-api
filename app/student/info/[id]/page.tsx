export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const studentInfo = await (await fetch(`http://localhost:3001/api/students/${id}`)).json()

  console.info(id)
  return (
    <div className="flex h-screen w-screen items-start backdrop-blur-lg backdrop-brightness-90 backdrop-sturate-150 bg-white-30 border-white/20 rounded-lg shadow-lg p-1 ">
      <div className="flex w-1/2 h-full items-center justify-center">
        <img src={`/images/student/portrait/${id}.webp`} className="h-[90vh]" />
      </div>
      <div className="flex w-1/2 h-full bg-orange-50">
        <p className="text-2xl font-semibold">{studentInfo.data.Name}</p>
      </div>
    </div>
  )
}
