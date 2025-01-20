import { config } from '@/config'
import Image from 'next/image'

export const RankItem = async ({
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
      <Image
        src={`${config.baseUrl}/${config.bucket}/objects/download?prefix=images/rank/${
          hard === 'INS' ? 'EX' : hard
        }.webp`}
        alt=""
        width={40}
        height={40}
        unoptimized
      />
      <p className="text-center text-2xl font-semibold text-white">{score}</p>
      <p className="text-center text-lg italic text-white">{`${hard} ${useTime}`}</p>
    </div>
  )
}
