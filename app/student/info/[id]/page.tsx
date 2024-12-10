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
  armorTypeTranslate,
  bulletTypeColor,
  bulletTypeTranslate,
  clubTranslate,
  schoolTranslate,
  tacticRoleTranslate,
} from '@/utils/constants'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const studentInfo: {
    data: {
      Name: string
      StarGrade: number
      SquadType: 'Main' | 'Support'
      TacticRole: keyof typeof tacticRoleTranslate
      BulletType: keyof typeof bulletTypeTranslate
      ArmorType: keyof typeof armorTypeTranslate
      School: keyof typeof schoolTranslate
      Club: keyof typeof clubTranslate
      StreetBattleAdaptation: number
      OutdoorBattleAdaptation: number
      IndoorBattleAdaptation: number
      WeaponType: string
      Position: string
      WeaponImg: string
      Equipment: string[]
      Gear: object
      MaxHP1: number
      MaxHP100: number
      AttackPower1: number
      AttackPower100: number
      DefensePower1: number
      DefensePower100: number
      HealPower1: number
      HealPower100: number
      AccuracyPoint: number
      DodgePoint: number
      CriticalPoint: number
      CriticalDamageRate: number
      AmmoCount: number
      AmmoCost: number
      Range: number
      RegenCost: number
      StabilityPoint: number
      CharacterVoice: string
      Birthday: string
      CharacterAge: string
      CharHeightMetric: string
      CharHeightImperial: string
      Designer: string
      Illustrator: string
      Hobby: string
      ProfileIntroduction: string
      CharacterSSRNew: string
    }
  } = await (await fetch(`${config.baseUrl}/api/students/${id}`)).json()
  const squadType = studentInfo.data.SquadType === 'Main' ? '突击' : '支援'
  const squadTypeColor =
    studentInfo.data.SquadType === 'Main' ? 'bg-red-600' : 'bg-blue-600'
  const transcendence = [
    [0, 1000, 1200, 1400, 1700],
    [0, 500, 700, 900, 1400],
    [0, 750, 1000, 1200, 1500],
  ]
  let transcendenceAttack = 1
  let transcendenceHP = 1
  let transcendenceHeal = 1

  for (let i = 0; i < studentInfo.data.StarGrade; i++) {
    transcendenceAttack += transcendence[0][i] / 10000
    transcendenceHP += transcendence[1][i] / 10000
    transcendenceHeal += transcendence[2][i] / 10000
  }

  const getTimeAttackLevelScale = (level: number) => {
    if (level <= 1) {
      return 0
    } else if (level == 2) {
      return 0.0101
    } else if (level <= 24) {
      return 0.0707
    } else if (level == 25) {
      return 0.0808
    } else if (level <= 39) {
      return 0.1919
    } else if (level == 40) {
      return 0.202
    } else if (level <= 64) {
      return 0.4444
    } else if (level == 65) {
      return 0.4545
    } else if (level <= 77) {
      return 0.7172
    } else if (level == 78) {
      return 0.7273
    } else if (level >= 79) {
      return Number(((level - 1) / 99).toFixed(4))
    } else {
      return 0
    }
  }

  const interpolateStat = (
    stat1: number,
    stat100: number,
    level: number,
    transcendence: number = 1,
    statGrowthType: string = 'Standard'
  ) => {
    let levelScale: number
    switch (statGrowthType) {
      case 'TimeAttack':
        levelScale = getTimeAttackLevelScale(level)
        break
      case 'LateBloom':
      case 'Premature':
        levelScale = (level - 1) / 99
        break
      case 'Standard':
      default:
        levelScale = Number(((level - 1) / 99).toFixed(4))
        break
    }
    return Math.ceil(
      Number(
        Math.round(
          Number((stat1 + (stat100 - stat1) * levelScale).toFixed(4)) *
            transcendence
        ).toFixed(4)
      )
    )
  }

  return (
    <div className="flex h-screen w-screen items-start p-4 bg-gradient-to-tr from-white via-gray-400 to-gray-700">
      <div className="flex w-1/2 h-full py-2 items-center justify-center">
        <img
          src={`/images/student/portrait/${id}.webp`}
          className="object-contain h-full"
        />
      </div>
      <div className="flex-row w-1/2 h-full items-center py-4">
        <p className="text-2xl font-sans font-bold italic">
          {studentInfo.data.Name}
        </p>
        <div className="w-full h-3"></div>
        <div className="flex">
          <div className="inline-flex items-center px-2 rounded-full backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
            {Array.from({ length: studentInfo.data.StarGrade }).map((_, i) => (
              <img
                key={i}
                src="/images/ui/Common_Icon_Formation_Star.png"
                className="w-4 h-4"
              />
            ))}
          </div>
          <div className="w-3"></div>
          <div
            className={`inline-flex items-center px-3 rounded-full ${squadTypeColor}`}
          >
            <p className="text-white font-sans">{squadType}</p>
          </div>
        </div>
        <div className="h-3"></div>
        <div className="flex justify-between">
          {/* left side */}
          <div className="flex-row">
            <div className="flex items-start">
              <ItemCard
                imgPath={`/images/ui/Role_${studentInfo.data.TacticRole}.png`}
                text={tacticRoleTranslate[studentInfo.data.TacticRole]}
              />
              <div className="w-2"></div>
              <ItemCardWithBG
                imgPath={`/images/ui/Type_Attack.png`}
                imgBG={bulletTypeColor[studentInfo.data.BulletType]}
                text={bulletTypeTranslate[studentInfo.data.BulletType]}
              />
              <div className="w-2"></div>
              <ItemCardWithBG
                imgPath={`/images/ui/Type_Defense.png`}
                imgBG={armorTypeColor[studentInfo.data.ArmorType]}
                text={armorTypeTranslate[studentInfo.data.ArmorType]}
              />
            </div>
            <div className="h-1"></div>
            <div className="flex h-17 items-start">
              <ItemCard
                imgPath={`/images/schoolicon/School_Icon_${studentInfo.data.School.toUpperCase()}_W.png`}
                text={`${schoolTranslate[studentInfo.data.School]}/${
                  clubTranslate[studentInfo.data.Club]
                }`}
              />
            </div>
          </div>
          {/* right side */}
          <div className="flex">
            <TerrainCard
              img1="/images/ui/Terrain_Street.png"
              img2={`/images/ui/${
                adaptresultTranslate[studentInfo.data.StreetBattleAdaptation]
              }.png`}
            />
            <div className="w-1"></div>
            <TerrainCard
              img1="/images/ui/Terrain_Outdoor.png"
              img2={`/images/ui/${
                adaptresultTranslate[studentInfo.data.OutdoorBattleAdaptation]
              }.png`}
            />
            <div className="w-1"></div>
            <TerrainCard
              img1="/images/ui/Terrain_Indoor.png"
              img2={`/images/ui/${
                adaptresultTranslate[studentInfo.data.IndoorBattleAdaptation]
              }.png`}
            />
            <div className="w-1"></div>
            <div className="flex-row h-full p-1 rounded-md backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
              <div className="flex">
                <img
                  src="/images/ui/Combat_Icon_Cover_Ally.png"
                  className="h-6"
                ></img>
                <p className="font-sans font-bold italic">{`${
                  studentInfo.data.WeaponType
                }/${studentInfo.data.Position.toUpperCase()}`}</p>
              </div>
              <div className="flex w-full items-center">
                <img
                  src={`/images/weapon/${studentInfo.data.WeaponImg}.webp`}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-1"></div>
        <div className="flex w-full rounded-md items-center justify-center p-1 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20 shadow-lg">
          {studentInfo.data.Equipment.map((equipment: string) => (
            <>
              <EquipmentCard
                key={equipment}
                src={`/images/equipment/icon/equipment_icon_${equipment.toLowerCase()}_tier1.webp`}
              />
              <div className="w-3"></div>
            </>
          ))}
          <div className="w-[1px] h-16 bg-gray-500"></div>
          <div className="w-3"></div>
          {Object.keys(studentInfo.data.Gear).length !== 0 ? (
            <EquipmentCard src={`/images/gear/icon/${id}.webp`} />
          ) : (
            <EquipmentCard src={`/images/gear/empty.png`} />
          )}
        </div>
        <div className="h-3"></div>
        <div className="flex w-full rounded-md items-center p-1 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
          <div className="grid grid-cols-2 w-full">
            <DetailTableItem
              icon="/images/staticon/Stat_MaxHP.png"
              text="最大HP"
              value={interpolateStat(
                studentInfo.data.MaxHP1,
                studentInfo.data.MaxHP100,
                11,
                transcendenceHP
              ).toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_AttackPower.png"
              text="攻击力"
              value={interpolateStat(
                studentInfo.data.AttackPower1,
                studentInfo.data.AttackPower100,
                11,
                transcendenceAttack
              ).toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_DefensePower.png"
              text="防御力"
              value={interpolateStat(
                studentInfo.data.DefensePower1,
                studentInfo.data.DefensePower100,
                1
              ).toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_HealPower.png"
              text="治疗力"
              value={interpolateStat(
                studentInfo.data.HealPower1,
                studentInfo.data.HealPower100,
                1,
                transcendenceHeal
              ).toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_AccuracyPoint.png"
              text="命中值"
              value={studentInfo.data.AccuracyPoint.toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_DodgePoint.png"
              text="闪避值"
              value={studentInfo.data.DodgePoint.toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_CriticalPoint.png"
              text="暴击值"
              value={studentInfo.data.CriticalPoint.toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_CriticalChanceResistPoint.png"
              text="暴击抵抗力"
              value={'100'}
            />
            {/* TODO:计算暴伤 */}
            <DetailTableItem
              icon="/images/staticon/Stat_CriticalDamageRate.png"
              text="暴击伤害"
              value={`${studentInfo.data.CriticalDamageRate / 100}%`}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_CriticalDamageResistRate.png"
              text="暴击伤害抵抗率"
              value={'50'}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_StabilityPoint.png"
              text="稳定值"
              value={studentInfo.data.StabilityPoint.toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_Range.png"
              text="普通攻击射程"
              value={studentInfo.data.Range.toString()}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_OppressionPower.png"
              text="群控强化"
              value={'100'}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_OppressionResist.png"
              text="群控抵抗"
              value={'100'}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_DefensePenetration.png"
              text="防御无视值"
              value={'0'}
            />
            <DetailTableItem
              icon="/images/staticon/Stat_AmmoCount.png"
              text="装弹数"
              value={`${studentInfo.data.AmmoCount}(${studentInfo.data.AmmoCost})`}
            />
          </div>
        </div>
        <div className="h-3"></div>
        <div className="flex-row w-full rounded-md items-center p-1 backdrop-blur-md backdrop-brightness-110 backdrop-saturate-150 bg-white/30 border border-white/20">
          <div className="grid grid-cols-2 w-full">
            <InfoItem title="CV" vlaue={studentInfo.data.CharacterVoice} />
            <InfoItem title="生日" vlaue={studentInfo.data.Birthday} />
            <InfoItem title="年龄" vlaue={studentInfo.data.CharacterAge} />
            <InfoItem
              title="身高"
              vlaue={`${studentInfo.data.CharHeightMetric}(${studentInfo.data.CharHeightImperial})`}
            />
            <InfoItem title="设计" vlaue={studentInfo.data.Designer} />
            <InfoItem title="原画" vlaue={studentInfo.data.Illustrator} />
            <div className="col-span-2 text-center p-1">
              <div className="flex w-full items-center justify-between">
                <p>爱好</p>
                <p className="font-bold">{studentInfo.data.Hobby}</p>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-400"></div>
          <div className="px-1">
            <p className="whitespace-pre-line">
              {`\n${studentInfo.data.ProfileIntroduction}`}
            </p>
            <p className="whitespace-pre-line font-bold italic">
              {`\n"${studentInfo.data.CharacterSSRNew}"`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
