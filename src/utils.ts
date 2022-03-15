import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"

export function parseBigNumberToFloat(val: BigNumber, decimals: number = 18) {
  if (!val) {
    return 0
  }

  const formatted = formatUnits(val, decimals)
  const parsed = parseFloat(formatted)
  return parsed
}
