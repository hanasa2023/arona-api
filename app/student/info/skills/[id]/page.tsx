import { ItemCard } from '@/components/ItemCard'
import { SkillDetailTableItem } from '@/components/SkillDetailTableItem'
import { SkillIcon } from '@/components/SkillIcon'
import { SkillListItem } from '@/components/SkillListItem'
import { config } from '@/config'
import { skillColor, squadTypeColor } from '@/utils/constants'
import { Student } from '@/utils/student'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const student = new Student(id)
  await student.init()
  const localization = await (
    await fetch(`${config.baseUrl}/data/zh/localization.min.json`)
  ).json()

  return (
    <div
      id="skill-card"
      className="flex w-screen items-center justify-center p-4 bg-gradient-to-tr from-white via-gray-400 to-gray-700"
    >
      <div className="flex w-1/2 h-full py-2 items-center justify-center">
        <img
          src={`${config.baseUrl}/images/student/portrait/${id}.webp`}
          className="object-contain h-full"
        />
      </div>
      <div className="flex-row w-1/2 h-full items-center">
        <p className="text-2xl font-bold italic">{student.data!.Name}</p>
        <div className="w-full h-3"></div>
        <div className="flex">
          <div className="inline-flex items-center px-2 rounded-full backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
            {Array.from({
              length: student.data!.StarGrade || 0,
            }).map((_, i) => (
              <img
                key={i}
                src={`${config.baseUrl}/images/ui/Common_Icon_Formation_Star.png`}
                className="w-4 h-4"
              />
            ))}
          </div>
          <div className="w-3"></div>
          <div
            className={`inline-flex items-center px-3 rounded-full ${
              squadTypeColor[student.data!.SquadType]
            }`}
          >
            <p className="text-white">
              {localization['SquadType'][student.data!.SquadType]}
            </p>
          </div>
        </div>
        <div className="h-3"></div>
        {/* autoattack card */}
        {student.data!.SquadType === 'Main' ? (
          <>
            <div className="flex-row w-full rounded-md p-2 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
              <div className="flex items-center justify-start">
                <SkillIcon
                  icon={`${config.baseUrl}/images/skill/COMMON_SKILLICON_TARGET.webp`}
                  color={skillColor[student.data!.BulletType]}
                />
                <div className="flex-row px-2">
                  <p className="text-2xl">普通攻击</p>
                  <p>
                    对1名敌方单位造成自身攻击力
                    {Number(student.data!.Skills[0].Effects[0].Hits) / 100}
                    %的伤害
                  </p>
                </div>
              </div>
              <div className="h-2"></div>
              <div className="flex">
                <ItemCard
                  imgPath={`${config.baseUrl}/images/staticon/Stat_Range.png`}
                  text={student.data!.Range.toString()}
                />
                <div className="w-2"></div>
                <ItemCard
                  imgPath={`${config.baseUrl}/images/staticon/Stat_AmmoCount.png`}
                  text={`${student.data!.AmmoCount}(${student.data!.AmmoCost})`}
                />
              </div>
              <div className="h-2"></div>
              <div className="grid grid-cols-1 rounded-md backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
                <SkillDetailTableItem
                  text="普攻准备时间"
                  value={`${(
                    student.data!.Skills[0].Effects[0].Frames
                      .AttackEnterDuration / 30
                  )
                    .toFixed(2)
                    .replace(/\.?0+$/, '')}秒`}
                />
                <SkillDetailTableItem
                  text="普攻持续时间"
                  value={`${(
                    student.data!.Skills[0].Effects[0].Frames
                      .AttackIngDuration / 30
                  )
                    .toFixed(2)
                    .replace(/\.?0+$/, '')}秒`}
                />
                <SkillDetailTableItem
                  text="普攻开火间隔"
                  value={`${(
                    student.data!.Skills[0].Effects[0].Frames
                      .AttackBurstRoundOverDelay / 30
                  )
                    .toFixed(2)
                    .replace(/\.?0+$/, '')}秒`}
                />
                <SkillDetailTableItem
                  text="普攻前摇/后摇"
                  value={`${(
                    student.data!.Skills[0].Effects[0].Frames
                      .AttackStartDuration / 30
                  )
                    .toFixed(2)
                    .replace(/\.?0+$/, '')}/${(
                    student.data!.Skills[0].Effects[0].Frames
                      .AttackEndDuration / 30
                  )
                    .toFixed(2)
                    .replace(/\.?0+$/, '')}秒`}
                />
                <SkillDetailTableItem
                  text="换弹时间"
                  value={`${(
                    student.data!.Skills[0].Effects[0].Frames
                      .AttackReloadDuration / 30
                  )
                    .toFixed(2)
                    .replace(/\.?0+$/, '')}秒`}
                />
              </div>
              <div className="h-2"></div>
              <div className="flex">
                {student.data!.Skills[1].Radius &&
                student.data!.Skills[1].Radius[0].Type === 'Circle' ? (
                  <>
                    <ItemCard
                      imgPath={`${config.baseUrl}/images/skill/COMMON_SKILLICON_CIRCLE.webp`}
                      text={student.data!.Skills[1].Radius[0].Radius!.toString()}
                    />
                    <div className="w-2"></div>
                  </>
                ) : null}
                {student.data!.Skills[1].Radius &&
                student.data!.Skills[1].Radius[0].Type === 'Obb' ? (
                  <>
                    <ItemCard
                      imgPath={`${config.baseUrl}/images/skill/COMMON_SKILLICON_LINE.webp`}
                      text={student.data!.Skills[1].Radius[0].Height!.toString()}
                    />
                    <div className="w-2"></div>
                  </>
                ) : null}
                {student.data!.Skills[1].Range ? (
                  <>
                    <ItemCard
                      imgPath={`${config.baseUrl}/images/staticon/Stat_Range.png`}
                      text={student.data!.Skills[1].Range.toString()}
                    />
                    <div className="w-2"></div>
                  </>
                ) : null}
                {student.data!.Skills[1].Duration ? (
                  <ItemCard
                    imgPath={`${config.baseUrl}/images/staticon/Stat_GroggyTime.png`}
                    text={(student.data!.Skills[1].Duration! / 30).toFixed(2)}
                  />
                ) : null}
              </div>
            </div>
            <div className="h-2"></div>
            <div className="flex-row w-full rounded-md p-2 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
              <div className="flex items-center justify-start">
                <SkillIcon
                  icon={`${config.baseUrl}/images/skill/${
                    student.data!.Skills[1].Icon
                  }.webp`}
                  color={skillColor[student.data!.BulletType]}
                />
                <div className="flex-row px-2">
                  <p className="text-2xl">{student.data!.Skills[1].Name}</p>
                  <p className="font-bold italic">
                    EX技能/COST：{student.data!.Skills[1].Cost?.[0] ?? 999}
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-line px-1">
                {student
                  .data!.Skills[1].Desc?.replace(
                    '<?1>',
                    student.data!.Skills[1].Parameters?.[0]?.[0] ?? ''
                  )
                  .replace(
                    '<?2>',
                    student.data!.Skills[1].Parameters?.[1]?.[0] ?? ''
                  )
                  .replaceAll('；', '')}
              </p>
            </div>
            <div className="h-2"></div>
            <div className="flex-row w-full rounded-md p-2 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
              {student.data!.Skills.map((skill, index) => {
                if (
                  index < 2 ||
                  skill.SkillType === 'gearnormal' ||
                  skill.SkillType === 'weaponpassive' ||
                  skill.SkillType === 'upgrades'
                )
                  return null
                return (
                  <div key={index}>
                    <SkillListItem
                      skill={skill}
                      skillColor={skillColor[student.data!.BulletType]}
                      skillType={
                        localization[`student_skill_${skill.SkillType}`]
                      }
                      localization={localization}
                    />
                    <div className="h-2"></div>
                    {index === student.data!.Skills.length - 1 ? null : (
                      <div className="h-[1px] w-full bg-gray-400"></div>
                    )}
                    <div className="h-2"></div>
                  </div>
                )
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
