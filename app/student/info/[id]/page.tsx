import { DetailTableItem } from '@/components/DetailTableItem'
import { EquipmentCard } from '@/components/EquipmentCard'
import { InfoItem } from '@/components/InfoItem'
import { ItemCard } from '@/components/ItemCard'
import { ItemCardWithBG } from '@/components/ItemCardWithBG'
import { TerrainCard } from '@/components/TerrainCard'
import { config } from '@/config'
import {
  adaptresultTranslate,
  armorTypeColor,
  bulletTypeColor,
  squadTypeColor,
} from '@/utils/constants'
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
      id="info-card"
      className="flex w-screen items-center justify-center px-4 bg-gradient-to-tr from-white via-gray-400 to-gray-700"
    >
      <div className="flex w-1/2 h-full py-2 items-center justify-center">
        <img
          src={`${config.baseUrl}/images/student/portrait/${id}.webp`}
          className="object-contain h-full"
        />
      </div>
      <div className="flex-row w-1/2 h-full items-center py-4">
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
        <div className="flex justify-between">
          {/* left side */}
          <div className="flex-row">
            <div className="flex items-start">
              <ItemCard
                imgPath={`${config.baseUrl}/images/ui/Role_${
                  student.data!.TacticRole
                }.png`}
                text={localization['TacticRole'][student.data!.TacticRole]}
              />
              <div className="w-2"></div>
              <ItemCardWithBG
                imgPath={`${config.baseUrl}/images/ui/Type_Attack.png`}
                imgBG={bulletTypeColor[student.data!.BulletType]}
                text={localization['BulletType'][student.data!.BulletType]}
              />
              <div className="w-2"></div>
              <ItemCardWithBG
                imgPath={`${config.baseUrl}/images/ui/Type_Defense.png`}
                imgBG={armorTypeColor[student.data!.ArmorType]}
                text={localization['ArmorType'][student.data!.ArmorType]}
              />
            </div>
            <div className="h-1"></div>
            <div className="flex h-17 items-start">
              <ItemCard
                imgPath={`${
                  config.baseUrl
                }/images/schoolicon/School_Icon_${student.data!.School.toUpperCase()}_W.png`}
                text={`${localization['School'][student.data!.School]}/${
                  localization['Club'][student.data!.Club]
                }`}
              />
            </div>
          </div>
          {/* right side */}
          <div className="flex">
            <TerrainCard
              img1={`${config.baseUrl}/images/ui/Terrain_Street.png`}
              img2={`${config.baseUrl}/images/ui/${
                adaptresultTranslate[student.data!.StreetBattleAdaptation]
              }.png`}
            />
            <div className="w-1"></div>
            <TerrainCard
              img1={`${config.baseUrl}/images/ui/Terrain_Outdoor.png`}
              img2={`${config.baseUrl}/images/ui/${
                adaptresultTranslate[student.data!.OutdoorBattleAdaptation]
              }.png`}
            />
            <div className="w-1"></div>
            <TerrainCard
              img1={`${config.baseUrl}/images/ui/Terrain_Indoor.png`}
              img2={`${config.baseUrl}/images/ui/${
                adaptresultTranslate[student.data!.IndoorBattleAdaptation]
              }.png`}
            />
            <div className="w-1"></div>
            <div className="flex-row h-full p-1 rounded-md backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
              <div className="flex">
                <img
                  src={`${config.baseUrl}/images/ui/Combat_Icon_Cover_Ally.png`}
                  className="h-6"
                ></img>
                <p className="font-sans font-bold italic">{`${
                  student.data!.WeaponType
                }/${student.data!.Position.toUpperCase()}`}</p>
              </div>
              <div className="flex w-full items-center">
                <img
                  src={`${config.baseUrl}/images/weapon/${
                    student.data!.WeaponImg
                  }.webp`}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-1"></div>
        <div className="flex w-full rounded-md items-center justify-center p-1 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
          {student.data!.Equipment.map((equipment: string, index: number) => (
            <div key={index} className="flex">
              <EquipmentCard
                src={`${
                  config.baseUrl
                }/images/equipment/icon/equipment_icon_${equipment.toLowerCase()}_tier1.webp`}
              />
              <div className="w-3"></div>
            </div>
          ))}
          <div className="w-[1px] h-16 bg-gray-500"></div>
          <div className="w-3"></div>
          {Object.keys(student.data!.Gear).length !== 0 ? (
            <EquipmentCard
              src={`${config.baseUrl}/images/gear/icon/${id}.webp`}
            />
          ) : (
            <EquipmentCard src={`${config.baseUrl}/images/gear/empty.png`} />
          )}
        </div>
        <div className="h-3"></div>
        <div className="flex w-full rounded-md items-center p-1 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
          <div className="grid grid-cols-2 w-full">
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_MaxHP.png`}
              text="最大HP"
              value={student
                .interpolateStat(
                  student.data!.MaxHP1,
                  student.data!.MaxHP100,
                  11,
                  student.transcendenceHP
                )
                .toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_AttackPower.png`}
              text="攻击力"
              value={student
                .interpolateStat(
                  student.data!.AttackPower1,
                  student.data!.AttackPower100,
                  11,
                  student.transcendenceAttack
                )
                .toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_DefensePower.png`}
              text="防御力"
              value={student
                .interpolateStat(
                  student.data!.DefensePower1,
                  student.data!.DefensePower100,
                  1
                )
                .toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_HealPower.png`}
              text="治疗力"
              value={student
                .interpolateStat(
                  student.data!.HealPower1,
                  student.data!.HealPower100,
                  1,
                  student.transcendenceHeal
                )
                .toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_AccuracyPoint.png`}
              text="命中值"
              value={student.data!.AccuracyPoint.toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_DodgePoint.png`}
              text="闪避值"
              value={student.data!.DodgePoint.toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_CriticalPoint.png`}
              text="暴击值"
              value={student.data!.CriticalPoint.toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_CriticalChanceResistPoint.png`}
              text="暴击抵抗力"
              value={'100'}
            />
            {/* TODO:计算暴伤 */}
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_CriticalDamageRate.png`}
              text="暴击伤害"
              value={`${student.data!.CriticalDamageRate / 100}%`}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_CriticalDamageResistRate.png`}
              text="暴击伤害抵抗率"
              value={'50'}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_StabilityPoint.png`}
              text="稳定值"
              value={student.data!.StabilityPoint.toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_Range.png`}
              text="普通攻击射程"
              value={student.data!.Range.toString()}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_OppressionPower.png`}
              text="群控强化"
              value={'100'}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_OppressionResist.png`}
              text="群控抵抗"
              value={'100'}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_DefensePenetration.png`}
              text="防御无视值"
              value={'0'}
            />
            <DetailTableItem
              icon={`${config.baseUrl}/images/staticon/Stat_AmmoCount.png`}
              text="装弹数"
              value={`${student.data!.AmmoCount}(${student.data!.AmmoCost})`}
            />
          </div>
        </div>
        <div className="h-3"></div>
        <div className="flex-row w-full rounded-md items-center p-1 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
          <div className="grid grid-cols-2 w-full">
            <InfoItem title="CV" vlaue={student.data!.CharacterVoice} />
            <InfoItem title="生日" vlaue={student.data!.Birthday} />
            <InfoItem title="年龄" vlaue={student.data!.CharacterAge} />
            <InfoItem
              title="身高"
              vlaue={`${student.data!.CharHeightMetric}(${
                student.data!.CharHeightImperial
              })`}
            />
            <InfoItem title="设计" vlaue={student.data!.Designer} />
            <InfoItem title="原画" vlaue={student.data!.Illustrator} />
            <div className="col-span-2 text-center p-1">
              <div className="flex w-full items-center justify-between">
                <p>爱好</p>
                <p className="font-bold">{student.data!.Hobby}</p>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-400"></div>
          <div className="px-1">
            <p className="whitespace-pre-line">
              {`\n${student.data!.ProfileIntroduction}`}
            </p>
            <p className="whitespace-pre-line font-bold italic">
              {`\n"${student.data!.CharacterSSRNew}"`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
