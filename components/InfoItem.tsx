export const InfoItem = ({
  title,
  vlaue,
}: {
  title: string
  vlaue: string
}) => {
  return (
    <div className="col-span-1 p-1 text-center  border-gray-300">
      <div className="flex items-center justify-between">
        <p>{title}</p>
        <p className="font-bold">{vlaue}</p>
      </div>
    </div>
  )
}
