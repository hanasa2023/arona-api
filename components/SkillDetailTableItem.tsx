export const SkillDetailTableItem = ({
  text,
  value,
}: {
  text: string
  value: string
}) => {
  return (
    <div className="col-span-1 py-1 px-2 text-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="italic">{text}</p>
        </div>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  )
}
