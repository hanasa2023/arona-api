import { config } from '@/config'

export const RankItem = ({
  hard,
  score,
  useTime,
}: {
  hard: string
  score: number
  useTime: string
}) => {
  return (
    <div className="flex-row items-center justify-center">
      <img
        src={`${config.baseUrl}/images/rank/${
          hard === 'INS' ? 'EX' : hard
        }.webp`}
      />
      <p className="text-center text-2xl font-semibold text-white">{score}</p>
      <p className="text-center text-lg italic text-white">{`${hard} ${useTime}`}</p>
    </div>
  )
}
