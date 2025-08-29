// lib/types.ts

export type OHLCV = {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// Inputs tab only
export type BBInputs = {
    length: number
    maType: "SMA" | "EMA"
    source: "open" | "high" | "low" | "close"
    multiplier: number
    offset: number
}

// Full options (Inputs + Style)
export type BBOptions = BBInputs & {
    showBasis: boolean
    showUpper: boolean
    showLower: boolean
    showBackground: boolean
    basisColor: string
    upperColor: string
    lowerColor: string
    basisWidth: number
    upperWidth: number
    lowerWidth: number
    basisStyle: "solid" | "dashed"
    upperStyle: "solid" | "dashed"
    lowerStyle: "solid" | "dashed"
    backgroundOpacity: number
}
