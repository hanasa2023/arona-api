import { config } from '@/config'
import { StudentData } from '@/types'

const transcendence = [
  [0, 1000, 1200, 1400, 1700],
  [0, 500, 700, 900, 1400],
  [0, 750, 1000, 1200, 1500],
]

export class Student {
  id: string
  data: StudentData | null
  transcendenceAttack = 1
  transcendenceHP = 1
  transcendenceHeal = 1

  constructor(id: string) {
    this.id = id
    this.data = null
  }

  async init() {
    this.data = (
      await (await fetch(`${config.baseUrl}/api/student/${this.id}`)).json()
    )['data']

    for (let i = 0; i < this.data!.StarGrade; i++) {
      this.transcendenceAttack += transcendence[0][i] / 10000
      this.transcendenceHP += transcendence[1][i] / 10000
      this.transcendenceHeal += transcendence[2][i] / 10000
    }
  }

  getTimeAttackLevelScale(level: number) {
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

  interpolateStat(
    stat1: number,
    stat100: number,
    level: number,
    transcendence: number = 1,
    statGrowthType: string = 'Standard'
  ) {
    let levelScale: number
    switch (statGrowthType) {
      case 'TimeAttack':
        levelScale = this.getTimeAttackLevelScale(level)
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
}
