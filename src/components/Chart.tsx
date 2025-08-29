"use client"

import { useEffect, useRef, useMemo } from "react"
import {
    init,
    dispose,
    type Chart as KChart,
    type KLineData,
    type CandleType,
    type IndicatorFigureStylesCallbackData,
} from "klinecharts"
import type { OHLCV, BBOptions } from "@/lib/types"
import { computeBollingerBands } from "@/lib/indicators/bollinger"

function toK(data: OHLCV[]): KLineData[] {
    return data.map((d) => ({
        timestamp: d.timestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
    }))
}

type Props = {
    data: OHLCV[]
    bbOptions: BBOptions
    showBB: boolean
}

export function Chart({ data, bbOptions, showBB }: Props) {
    const chartRef = useRef<KChart | null>(null)

    const kData = useMemo(() => toK(data), [data])

    // Bollinger figures
    const figures = useMemo(() => {
        const f: any[] = []

        if (bbOptions.showBasis) {
            f.push({
                key: "basis",
                title: "Basis",
                type: "line",
                color: bbOptions.basisColor,
                styles: (_: IndicatorFigureStylesCallbackData) => ({
                    line: { size: bbOptions.basisWidth, style: bbOptions.basisStyle },
                }),
            })
        }

        if (bbOptions.showUpper) {
            f.push({
                key: "upper",
                title: "Upper",
                type: "line",
                color: bbOptions.upperColor,
                styles: () => ({
                    line: { size: bbOptions.upperWidth, style: bbOptions.upperStyle },
                }),
            })
        }

        if (bbOptions.showLower) {
            f.push({
                key: "lower",
                title: "Lower",
                type: "line",
                color: bbOptions.lowerColor,
                styles: () => ({
                    line: { size: bbOptions.lowerWidth, style: bbOptions.lowerStyle },
                }),
            })
        }

        if (bbOptions.showBackground) {
            f.push({
                key: "band",
                title: "Band",
                type: "polygon",
                // base + value tell polygon what to fill between
                baseValue: "lower",
                value: (d: any) => [d.upper, d.lower],
                styles: () => ({
                    polygon: {
                        style: "fill",
                        color: bbOptions.upperColor,
                        opacity: bbOptions.backgroundOpacity,
                    },
                }),
            })
        }

        return f
    }, [bbOptions])

    // init chart once
    useEffect(() => {
        const chart = init("kline-container")
        chartRef.current = chart

        chart.applyNewData(kData)

        chart.setStyles({
            grid: {
                horizontal: { show: true, line: { color: "#e0e0e0" } },
                vertical: { show: true, line: { color: "#e0e0e0" } },
            },
            candle: {
                type: "candle_solid" as CandleType,
                bar: {
                    upColor: "#26a69a",
                    downColor: "#ef5350",
                    noChangeColor: "#999",
                },
            },
            background: { color: "#ffffff" },
        })

        return () => dispose("kline-container")
    }, [])

    // update base data
    useEffect(() => {
        chartRef.current?.applyNewData(kData)
    }, [kData])

    // update BB indicator
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        try {
            chart.removeIndicator("candle_pane", "BB")
        } catch { }

        if (!showBB) return

        chart.createIndicator(
            {
                name: "BB",
                shortName: "BB",
                calc: (kLineData: KLineData[]) => {
                    const { basis, upper, lower } = computeBollingerBands(data, bbOptions)
                    return kLineData.map((_, i) => ({
                        basis: basis[i] ?? null,
                        upper: upper[i] ?? null,
                        lower: lower[i] ?? null,
                    }))
                },
                figures,
            },
            false,
            { id: "candle_pane" }
        )
    }, [figures, showBB, data, bbOptions])

    return (
        <div className="w-full rounded-2xl border border-gray-300 bg-white shadow">
            <div id="kline-container" className="h-[620px] w-full" />
        </div>
    )
}
