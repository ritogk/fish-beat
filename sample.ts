const reactionFrequencyAnimals = [
  {
    name: '人間',
    auditoryPressure: [
      { frequency: 100, db: 50 },
      { frequency: 200, db: 40 },
      { frequency: 300, db: 35 },
      { frequency: 400, db: 32 },
      { frequency: 500, db: 30 },
      { frequency: 600, db: 29 },
      { frequency: 700, db: 29 },
      { frequency: 800, db: 28 },
      { frequency: 900, db: 28 },
      { frequency: 1000, db: 28 },
      { frequency: 2000, db: 26 },
      { frequency: 3000, db: 18 },
      { frequency: 4000, db: 28 },
      { frequency: 5000, db: 31 },
      { frequency: 6000, db: 34 },
      { frequency: 7000, db: 38 },
      { frequency: 8000, db: 42 },
      { frequency: 9000, db: 45 }
    ]
  },
  {
    name: '金魚',
    auditoryPressure: [
      { frequency: 100, db: 88 },
      { frequency: 200, db: 72 },
      { frequency: 300, db: 69 },
      { frequency: 400, db: 62 },
      { frequency: 500, db: 62 },
      { frequency: 600, db: 62 },
      { frequency: 700, db: 62 },
      { frequency: 800, db: 62 },
      { frequency: 900, db: 62 },
      { frequency: 1000, db: 63 },
      { frequency: 2000, db: 80 },
      { frequency: 3000, db: 95 },
      { frequency: 4000, db: 115 }
    ]
  },
  {
    name: 'ブリ',
    auditoryPressure: [
      { frequency: 100, db: 110 },
      { frequency: 200, db: 82 },
      { frequency: 300, db: 92 },
      { frequency: 400, db: 88 },
      { frequency: 500, db: 92 },
      { frequency: 600, db: 94 },
      { frequency: 700, db: 96 },
      { frequency: 800, db: 98 },
      { frequency: 900, db: 99 },
      { frequency: 1000, db: 100 }
    ]
  },
  {
    name: 'ヤリイカ',
    auditoryPressure: [
      { frequency: 100, db: 120 },
      { frequency: 200, db: 112 },
      { frequency: 300, db: 120 },
      { frequency: 400, db: 125 },
      { frequency: 500, db: 130 }
    ]
  }
]

const func = async () => {
  // 人間と金魚の音圧の差を出力する
  const human = auditoryPressures[0]
  const fish = auditoryPressures[1]
  const humanPressure = human.auditoryPressure
  const fishPressure = fish.auditoryPressure
  const humanPressureLength = humanPressure.length
  const fishPressureLength = fishPressure.length

  const pressureDiff = [] as {
    frequency: number
    rate: number
  }[]
  for (let i = 0; i < humanPressureLength; i++) {
    pressureDiff.push({
      frequency: humanPressure[i].frequency,
      rate: fishPressure[i].pressure - humanPressure[i].pressure
    })
  }
  // この値を使って、web audio apiで周波数の音圧を金魚向けに変換する
  // 魚の方が感度が低いので、音圧を下げる事になる。
  console.log(pressureDiff)
}
func()
