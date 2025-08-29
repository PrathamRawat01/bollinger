import type { KLineData } from "klinecharts";

export interface BBResult {
    timestamp: number;
    basis?: number;
    upper?: number;
    lower?: number;
}

export interface BBOptions {
    length: number;
    stdDev: number;
    offset: number;
}

export function computeBollingerBands(data: KLineData[], options: BBOptions): BBResult[] {
    const { length, stdDev: stdDevMultiplier, offset } = options;
    const result: BBResult[] = data.map((d) => ({ timestamp: d.timestamp }));

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (i < length - 1 || !Number.isFinite(d.close)) continue;

        const closes = data
            .slice(Math.max(0, i - length + 1), i + 1)
            .map((c) => (Number.isFinite(c.close) ? c.close : 0));

        if (closes.length < length) continue;

        const sma = closes.reduce((a, b) => a + b, 0) / length;
        const stdDev = Math.sqrt(closes.reduce((a, b) => a + (b - sma) ** 2, 0) / length);

        const basis = sma;
        const upper = basis + stdDevMultiplier * stdDev;
        const lower = basis - stdDevMultiplier * stdDev;

        const targetIndex = i + offset;
        if (targetIndex >= 0 && targetIndex < result.length) {
            result[targetIndex] = { ...result[targetIndex], basis, upper, lower };
        }
    }

    return result;
}
