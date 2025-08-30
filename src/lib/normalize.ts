import type { OHLCV } from "@/lib/types"

type RawData = {
    timestamp?: number | string
    date?: string
    open: number | string
    high: number | string
    low: number | string
    close: number | string
    volume?: number | string
}

export function normalizeData(raw: RawData[]): OHLCV[] {
    if (!Array.isArray(raw)) return []

    return raw.map((d, i) => {
        let ts: number
        if (d.timestamp) {
            const v = Number(d.timestamp)
            ts = v < 10_000_000_000 ? v * 1000 : v
        } else if (d.date) {
            const parsed = new Date(d.date).getTime()
            ts = isFinite(parsed) ? parsed : Date.now() + i
        } else {
            ts = Date.now() + i
        }

        return {
            timestamp: ts,
            open: Number(d.open),
            high: Number(d.high),
            low: Number(d.low),
            close: Number(d.close),
            volume: Number(d.volume ?? 0),
        }
    })
}
