export const DetailTableItem = ({
  icon,
  text,
  value,
}: {
  icon: string
  text: string
  value: string
}) => {
  return (
    <div className="col-span-1 p-1 text-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={icon} className="h-8 invert"></img>
          <p className="font-sans">{text}</p>
        </div>
        <p className="font-sans font-bold">{value}</p>
      </div>
    </div>
  )
}
