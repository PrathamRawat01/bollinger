import type { OHLCV, BBOptions } from "@/lib/types"

// simple moving average
function SMA(values: number[], length: number): number[] {
    const res: number[] = []
    for (let i = 0; i < values.length; i++) {
        if (i < length - 1) {
            res.push(NaN)
            continue
        }
        const slice = values.slice(i - length + 1, i + 1)
        const avg = slice.reduce((a, b) => a + b, 0) / length
        res.push(avg)
    }
    return res
}

// population standard deviation
function stdDev(values: number[], length: number): number[] {
    const res: number[] = []
    for (let i = 0; i < values.length; i++) {
        if (i < length - 1) {
            res.push(NaN)
            continue
        }
        const slice = values.slice(i - length + 1, i + 1)
        const mean = slice.reduce((a, b) => a + b, 0) / length
        const variance =
            slice.reduce((a, b) => a + (b - mean) ** 2, 0) / length
        res.push(Math.sqrt(variance))
    }
    return res
}

// shift helper
function shift(arr: number[], offset: number): number[] {
    if (offset === 0) return arr
    const empty = new Array(Math.abs(offset)).fill(NaN)
    return offset > 0
        ? empty.concat(arr.slice(0, -offset))
        : arr.slice(-offset).concat(empty)
}

export function computeBollingerBands(
    data: OHLCV[],
    opts: BBOptions
): (OHLCV & { basis?: number; upper?: number; lower?: number })[] {
    const sourceValues = data.map((d) => {
        switch (opts.source) {
            case "open":
                return d.open
            case "high":
                return d.high
            case "low":
                return d.low
            default:
                return d.close
        }
    })

    const basis = SMA(sourceValues, opts.length)
    const dev = stdDev(sourceValues, opts.length)

    const upper = basis.map((b, i) =>
        isNaN(b) || isNaN(dev[i]) ? NaN : b + opts.multiplier * dev[i]
    )
    const lower = basis.map((b, i) =>
        isNaN(b) || isNaN(dev[i]) ? NaN : b - opts.multiplier * dev[i]
    )

    const b = shift(basis, opts.offset)
    const u = shift(upper, opts.offset)
    const l = shift(lower, opts.offset)

    // attach bands back onto candles
    return data.map((d, i) => ({
        ...d,
        basis: isNaN(b[i]) ? undefined : b[i],
        upper: isNaN(u[i]) ? undefined : u[i],
        lower: isNaN(l[i]) ? undefined : l[i],
    }))
}
