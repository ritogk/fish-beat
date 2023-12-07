export const calculateSoundPressureLevelGain = (initialSPL: number, desiredSPL: number): number => {
  // Calculate the required gain in dB
  const gain: number = desiredSPL - initialSPL

  // Calculate the factor by which the sound pressure must be increased
  // This is the antilogarithm of the gain/20
  const pressureIncreaseFactor: number = Math.pow(10, gain / 20)

  return pressureIncreaseFactor
}
