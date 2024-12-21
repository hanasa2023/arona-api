export interface StudentData {
  Name: string
  StarGrade: number
  SquadType: 'Main' | 'Support'
  TacticRole: 'DamageDealer' | 'Tanker' | 'Healer' | 'Supporter' | 'Vehicle'
  BulletType: 'Explosion' | 'Pierce' | 'Mystic' | 'Normal' | 'Sonic' | 'Mixed'
  ArmorType:
    | 'LightArmor'
    | 'HeavyArmor'
    | 'Unarmed'
    | 'ElasticArmor'
    | 'Normal'
    | 'Mixed'
  School:
    | 'Abydos'
    | 'Arius'
    | 'Gehenna'
    | 'Hyakkiyako'
    | 'Millennium'
    | 'RedWinter'
    | 'Shanhaijing'
    | 'SRT'
    | 'Trinity'
    | 'Valkyrie'
    | 'ETC'
    | 'Tokiwadai'
    | 'Sakugawa'
  Club:
    | 'Kohshinjo68'
    | 'Justice'
    | 'CleanNClearing'
    | 'BookClub'
    | 'Countermeasure'
    | 'Engineer'
    | 'FoodService'
    | 'Fuuki'
    | 'GourmetClub'
    | 'HoukagoDessert'
    | 'KnightsHospitaller'
    | 'MatsuriOffice'
    | 'Meihuayuan'
    | 'Onmyobu'
    | 'RemedialClass'
    | 'SPTF'
    | 'Shugyobu'
    | 'Endanbou'
    | 'TheSeminar'
    | 'TrainingClub'
    | 'TrinityVigilance'
    | 'Veritas'
    | 'NinpoKenkyubu'
    | 'GameDev'
    | 'RedwinterSecretary'
    | 'anzenkyoku'
    | 'SisterHood'
    | 'Class227'
    | 'Emergentology'
    | 'RabbitPlatoon'
    | 'PandemoniumSociety'
    | 'AriusSqud'
    | 'HotSpringsDepartment'
    | 'TeaParty'
    | 'PublicPeaceBureau'
    | 'BlackTortoisePromenade'
    | 'Genryumon'
    | 'LaborParty'
    | 'KnowledgeLiberationFront'
    | 'Hyakkayouran'
    | 'ShinySparkleSociety'
    | 'AbydosStudentCouncil'
    | 'EmptyClub'
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
  Skills: SkillsItem[]
}

export interface SkillsItem {
  SkillType: string
  Effects: EffectsItem[]
  Name?: string
  Desc?: string
  Parameters?: string[][]
  Cost?: number[]
  Duration?: number
  Range?: number
  Radius?: RadiusItem1[]
  Icon?: string
}

export interface EffectsItem {
  Type: string
  Hits: number[]
  Scale: number[]
  Frames: {
    AttackEnterDuration: number
    AttackStartDuration: number
    AttackEndDuration: number
    AttackBurstRoundOverDelay: number
    AttackIngDuration: number
    AttackReloadDuration: number
  }
  CriticalCheck: string
}

export interface RadiusItem1 {
  Type: string
  Radius?: number
  Width?: number
  Height?: number
}

export interface IllustDTO {
  id: number
  title: string
  author: string
  authorId: number
  tags: string
  imgUrl: string
  aiType: number
  restrict: string
  loveMembers: number
  hateMembers: number
}

export interface Illust {
  pid: number
  uid: number
  author: string
  title: string
  tags: string[]
  imageUrl: string
  aiType: boolean
  restrict: string
  loveMembers: number
  hateMembers: number
}

export interface IRequest {
  num: number
  tags: string[]
  isAI: boolean
  restrict: string
}
export interface IllustDetails {
  id: string
  title: string
  url_big: string
  tags: string[]
  restrict: string
  x_restrict: string
  ai_type: number
  author_details: AuthorDetailsDTO
  bookmark_user_total: number
}

export interface AuthorDetailsDTO {
  user_id: string
  user_name: string
}
