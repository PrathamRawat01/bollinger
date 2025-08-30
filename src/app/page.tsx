"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Chart } from "@/components/Chart"
import { BollingerSettings } from "@/components/bollinger/BollingerSettings"
import { normalizeData } from "@/lib/normalize"
import type { OHLCV, BBOptions } from "@/lib/types"
import tsla from "../../public/data/tsla.json"

export default function Page() {
  const [data, setData] = useState<OHLCV[]>([])
  const [showBB, setShowBB] = useState(false)
  const [bbOptions, setBbOptions] = useState<BBOptions>({
    length: 4,
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
    setData(normalizeData(tsla as unknown as OHLCV[]))
  }, [])

  return (
    //keeping a ration of 70 , 26 for a good layout and 4 gap
    <main className="flex min-h-screen bg-gradient-to-br from-blue-300 to-pink-200 ease-in text-gray-900 p-4 gap-4">
      {/* Chart 70% */}
      <div className="w-[70%]">
        <Chart data={data} bbOptions={bbOptions} showBB={showBB} />
      </div>

      {/* Settings 26% */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[26%] rounded-2xl p-8 overflow-y-auto scrollbar-hide 
                   bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg"
      >
        <BollingerSettings
          settings={bbOptions}
          onChange={setBbOptions}
          showBB={showBB}
          onToggleBB={setShowBB}
        />
      </motion.div>
    </main>
  )
}
