const auditoryPressures = [
  {
    name: '人間',
    auditoryPressure: [
      { frequency: 100, pressure: 50 },
      { frequency: 200, pressure: 40 },
      { frequency: 300, pressure: 35 },
      { frequency: 400, pressure: 32 },
      { frequency: 500, pressure: 30 },
      { frequency: 600, pressure: 29 },
      { frequency: 700, pressure: 29 },
      { frequency: 800, pressure: 28 },
      { frequency: 900, pressure: 28 },
      { frequency: 1000, pressure: 28 }
    ]
  },
  {
    name: '金魚',
    auditoryPressure: [
      { frequency: 100, pressure: 88 },
      { frequency: 200, pressure: 72 },
      { frequency: 300, pressure: 69 },
      { frequency: 400, pressure: 62 },
      { frequency: 500, pressure: 62 },
      { frequency: 600, pressure: 62 },
      { frequency: 700, pressure: 62 },
      { frequency: 800, pressure: 62 },
      { frequency: 900, pressure: 62 },
      { frequency: 1000, pressure: 63 }
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
      rate: fishPressure[i].pressure / humanPressure[i].pressure
    })
  }
  // この値を使って、web audio apiで周波数の音圧を金魚向けに変換する
  // 魚の方が感度が低いので、音圧を下げる事になる。
  console.log(pressureDiff)
}
func()
