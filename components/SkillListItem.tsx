import { SkillIcon } from './SkillIcon'
import { SkillsItem } from '@/types'
import { ItemCard } from './ItemCard'
import React from 'react'

export const SkillListItem = ({
  skill,
  skillColor,
  skillType,
  localization,
}: {
  skill: SkillsItem
  skillColor: string
  skillType: string
  localization: any
}) => {
  const skillDesc = skill.Desc?.replace(
    '<?1>',
    skill.Parameters?.[0]?.[0] ?? ''
  )
    .replace('<?2>', skill.Parameters?.[1]?.[0] ?? '')
    .replaceAll('；', '')

  const parseStringToElements = (input: string): React.ReactNode => {
    return input.split(/(<b:\w+>)/g).map((part, index) => {
      if (/<b:(\w+)>/.test(part)) {
        const match = part.match(/<b:(\w+)>/)
        const src = match ? `/images/buff/Buff_${match[1]}.webp` : ''
        return (
          <div className="inline-flex px-2 items-center justify-center rounded-full bg-red-200">
            <img key={index} src={src} className="h-6 " alt={src} />
            {match ? (
              <p className="text-red-800">
                {localization['BuffName'][`Buff_${match[1]}`]}
              </p>
            ) : (
              <></>
            )}
          </div>
        )
      }
      return part
    })
  }

  return (
    <>
      <div className="flex items-center justify-start">
        <SkillIcon
          icon={`/images/skill/${skill.Icon}.webp`}
          color={skillColor}
        />
        <div className="flex-row px-2">
          <p className="text-2xl">{skill.Name}</p>
          <p className="font-bold italic">{skillType}</p>
        </div>
      </div>
      <div className="whitespace-pre-line px-1 py-2">
        {parseStringToElements(skillDesc!)}
      </div>
      <div className="flex">
        {skill.Radius && skill.Radius[0].Type == 'Circle' ? (
          <>
            <ItemCard
              imgPath="/images/skill/COMMON_SKILLICON_CIRCLE.webp"
              text={skill.Radius[0].Radius!.toString()}
            />
            <div className="w-2"></div>
          </>
        ) : (
          <></>
        )}
        {skill.Radius && skill.Radius[0].Type == 'Obb' ? (
          <>
            <ItemCard
              imgPath="/images/skill/COMMON_SKILLICON_LINE.webp"
              text={skill.Radius[0].Height!.toString()}
            />
            <div className="w-2"></div>
          </>
        ) : (
          <></>
        )}
        {skill.Range ? (
          <>
            <ItemCard
              imgPath="/images/staticon/Stat_Range.png"
              text={skill.Range.toString()}
            />
            <div className="w-2"></div>
          </>
        ) : (
          <></>
        )}
        {skill.Duration ? (
          <>
            <ItemCard
              imgPath="/images/staticon/Stat_GroggyTime.png"
              text={(skill.Duration! / 30).toFixed(2)}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
