import { RankItem } from '@/components/RankItem'
import { config } from '@/config'
import { BattleData, RankLineData, SeasonData, SeasonRecordData } from '@/types'
import { raidServer } from '@/utils/constants'
import { iFetch } from '@/utils/ifetch'
import { formatTime } from '@/utils/tools'
import { bossTranslate, serverTranslate } from '@/utils/translate'

// TODO: 国际服档线
export default async function Page({
  params,
}: {
  params: Promise<{ server: number }>
}) {
  const { server } = await params
  const serverName = serverTranslate[server]
  const seasonList: SeasonData[] = (
    await iFetch(`${raidServer}/api/season/list`, { server })
  )['data'].reverse()
  const season = seasonList[seasonList.length - 1].season
  const rankData: RankLineData[] = (
    await iFetch(`${raidServer}/api/v2/rank/list_top`, {
      server,
      season,
    })
  )['data']
  const seasonRecordData: SeasonRecordData[] = (
    await iFetch(
      `${raidServer}/api/season/record_time/${season}?server=${server}`,
      null,
      'GET'
    )
  )['data']
  let battleData: BattleData | null = null
  try {
    battleData = (
      await iFetch(
        `https://media.arona.ai/data/v3/raid/${season}/total`,
        null,
        'GET'
      )
    )['diffTrophyCutAndDiffTop']
  } catch (e) {
    console.error(e)
  }
  const bossId = seasonList[season].bossId

  return (
    <>
      {rankData.length ? (
        <div className="flex items-center w-full h-screen justify-center">
          <div
            id="card"
            className="flex-row w-[600px] items-center justify-center rounded-lg px-8 py-4"
            style={{
              backgroundImage: `url(${config.baseUrl}/images/raid/Boss_Portrait_${bossTranslate[bossId]}_LobbyBG.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <p className="text-center text-teal-100 text-xl font-semibold">{`${serverName}总力战第${season}期 - ${seasonList[season].map.value}${seasonList[season].boss}`}</p>
            <p className="text-center text-lg text-white">{`${
              seasonRecordData.pop()?.value
            }`}</p>
            <div className="flex w-full items-center justify-between">
              {rankData.map((d, index) => {
                return (
                  <RankItem
                    key={index}
                    hard={d.hard}
                    score={d.bestRankingPoint}
                    useTime={d.battleTime}
                  />
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full h-screen justify-center">
          <div
            id="card"
            className="flex-row w-[600px] bg-slate-400 items-center justify-center rounded-lg px-8 py-4"
          >
            <p className="text-center text-teal-100 text-xl font-semibold">{`${serverName}总力战第${season}期`}</p>
            <div className="flex w-full items-center justify-between">
              <RankItem
                hard={'INS'}
                score={battleData?.platinum?.[0] ?? 0}
                useTime={formatTime(battleData?.platinum?.[1] ?? 0)}
              />
              <RankItem
                hard={'HC'}
                score={battleData?.gold?.[0] ?? 0}
                useTime={formatTime(battleData?.gold?.[1] ?? 0)}
              />
              <RankItem
                hard={'VH'}
                score={battleData?.silver?.[0] ?? 0}
                useTime={formatTime(battleData?.silver?.[1] ?? 0)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
