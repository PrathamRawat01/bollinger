"use client"

import { useEffect, useState } from "react"
import { Chart } from "@/components/Chart"
import { BollingerSettings } from "@/components/bollinger/BollingerSettings"
import { normalizeData } from "@/lib/normalize"
import type { OHLCV, BBOptions } from "@/lib/types"
import tsla from "../../public/data/tsla.json"

export default function Page() {
  const [data, setData] = useState<OHLCV[]>([])
  const [showBB, setShowBB] = useState(false)
  const [bbOptions, setBbOptions] = useState<BBOptions>({
    length: 20,
    maType: "SMA",
    source: "close",
    multiplier: 2,
    offset: 0,
    showBasis: true,
    showUpper: true,
    showLower: true,
    showBackground: true,
    basisColor: "#2962FF",
    upperColor: "#FF6D00",
    lowerColor: "#00C853",
    basisWidth: 2,
    upperWidth: 2,
    lowerWidth: 2,
    basisStyle: "solid",
    upperStyle: "solid",
    lowerStyle: "solid",
    backgroundOpacity: 0.1,
  })

  useEffect(() => {
    setData(normalizeData(tsla as any[]))
  }, [])

  return (
    <main className="flex min-h-screen bg-white text-gray-900 p-4 gap-4">
      {/* Chart 70% */}
      <div className="w-[70%]">
        <Chart data={data} bbOptions={bbOptions} showBB={showBB} />
      </div>

      {/* Settings 26% */}
      <div className="w-[26%] bg-gray-100 rounded-2xl p-4 overflow-y-auto scrollbar-hide">
        <BollingerSettings
          settings={bbOptions}
          onChange={setBbOptions}
          showBB={showBB}
          onToggleBB={setShowBB}
        />
      </div>
    </main>
  )
}
