"use client";

import { useEffect, useRef, useMemo } from "react";
import {
    init,
    dispose,
    registerIndicator,
    type Chart as KChart,
    type KLineData,
    type CandleType,
    type IndicatorFigureStylesCallbackData,
} from "klinecharts";

import type { OHLCV, BBOptions } from "@/lib/types";
import { computeBollingerBands } from "@/lib/indicators/bollinger";

function toK(data: OHLCV[]): KLineData[] {
    return data.map((d) => ({
        timestamp: d.timestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
    }));
}

type Props = { data: OHLCV[]; bbOptions: BBOptions; showBB: boolean };

const INDICATOR_NAME = "BB";

// map UI to klinecharts values
const toLineStyle = (v: string): "solid" | "dashed" =>
    v?.toLowerCase().startsWith("dash") ? "dashed" : "solid";

// hex + opacity → rgba()
function withOpacity(hex: string, opacity: number) {
    const h = (hex ?? "").replace("#", "");
    const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
    const n = parseInt(full || "000000", 16);
    const r = (n >> 16) & 255,
        g = (n >> 8) & 255,
        b = n & 255;
    const a = Math.max(0, Math.min(1, opacity ?? 1));
    return `rgba(${r},${g},${b},${a})`;
}

/** Shape of a single indicator point we feed to the klinecharts figures */
type BBPoint = {
    basis?: number | null;
    upper?: number | null;
    lower?: number | null;
};

export function Chart({ data, bbOptions, showBB }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<KChart | null>(null);
    const registeredRef = useRef(false);

    const kData = useMemo(() => toK(data), [data]);

    // --- figures (live update with bbOptions) ---
    const figures = useMemo(() => {
        const f: Array<{
            key: string;
            title?: string;
            type: "line" | "polygon";
            styles: (
                _: IndicatorFigureStylesCallbackData<BBPoint>
            ) => Record<string, unknown>;
            baseValue?: unknown;
            value?: (d: BBPoint) => [number | null, number | null];
        }> = [];

        if (bbOptions.showBasis) {
            f.push({
                key: "basis",
                title: "Basis",
                type: "line",
                styles: () => ({
                    color: bbOptions.basisColor,
                    size: bbOptions.basisWidth,
                    style: toLineStyle(bbOptions.basisStyle),
                }),
            });
        }

        if (bbOptions.showUpper) {
            f.push({
                key: "upper",
                title: "Upper",
                type: "line",
                styles: () => ({
                    color: bbOptions.upperColor,
                    size: bbOptions.upperWidth,
                    style: toLineStyle(bbOptions.upperStyle),
                }),
            });
        }

        if (bbOptions.showLower) {
            f.push({
                key: "lower",
                title: "Lower",
                type: "line",
                styles: () => ({
                    color: bbOptions.lowerColor,
                    size: bbOptions.lowerWidth,
                    style: toLineStyle(bbOptions.lowerStyle),
                }),
            });
        }

        if (bbOptions.showBackground) {
            f.push({
                key: "band",
                title: "Band",
                type: "polygon",
                baseValue: "lower",
                value: (d: BBPoint) => [d.upper ?? null, d.lower ?? null],
                styles: () => ({
                    style: "fill",
                    color: withOpacity(bbOptions.upperColor, bbOptions.backgroundOpacity),
                }),
            });
        }

        return f;
    }, [bbOptions]);

    // --- init chart once on mount ---
    useEffect(() => {
        if (!containerRef.current) return;

        const chart = init(containerRef.current);
        chartRef.current = chart;

        // guard because init may return null per typings
        if (chart) {
            // apply initial data & styles
            chart.applyNewData(kData);
            chart.setStyles({
                grid: {
                    horizontal: { show: true, color: "#e0e0e0" },
                    vertical: { show: true, color: "#e0e0e0" },
                },
                layout: {
                    background: { color: "#ffffff" },
                },
                candle: {
                    type: "candle_solid" as CandleType,
                    bar: {
                        upColor: "#26a69a",
                        downColor: "#ef5350",
                    },
                },
            });
        }

        // cleanup
        return () => {
            try {
                if (chartRef.current) {
                    try {
                        chartRef.current.removeIndicator("candle_pane", INDICATOR_NAME);
                    } catch {
                        /* ignore */
                    }
                }
            } finally {
                dispose(containerRef.current!);
                chartRef.current = null;
                registeredRef.current = false;
            }
        };
        // init once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- apply new price data whenever kData changes ---
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.applyNewData(kData);
        }
    }, [kData]);

    // --- indicator lifecycle & live updates ---
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        if (!showBB) {
            try {
                chart.removeIndicator("candle_pane", INDICATOR_NAME);
            } catch {
                // ignore if not present
            }
            registeredRef.current = false;
            return;
        }

        // compute bollinger results
        const bbResult = computeBollingerBands(data, bbOptions);
        const indicatorData: BBPoint[] = bbResult.map((d) => ({
            basis: d.basis ?? null,
            upper: d.upper ?? null,
            lower: d.lower ?? null,
        }));

        // If not registered yet, register the indicator skeleton (figures/data will be overridden)
        if (!registeredRef.current) {
            try {
                registerIndicator({
                    name: INDICATOR_NAME,
                    shortName: "BB",
                    calc: () => indicatorData,
                    figures,
                });
                registeredRef.current = true;
            } catch {
                // some environments may already have it registered globally — that's fine
                registeredRef.current = true;
            }

            // create the indicator on the candle pane (guard with try/catch)
            try {
                chart.createIndicator(INDICATOR_NAME, false, { id: "candle_pane" });
            } catch {
                // ignore if already exists
            }
        } else {
            // override data & figures on subsequent updates
            try {
                chart.overrideIndicator({
                    name: INDICATOR_NAME,
                    calc: () => indicatorData,
                    figures,
                });
            } catch {
                // if override fails for any reason, try re-registering gracefully
                try {
                    registerIndicator({
                        name: INDICATOR_NAME,
                        shortName: "BB",
                        calc: () => indicatorData,
                        figures,
                    });
                    chart.createIndicator(INDICATOR_NAME, false, { id: "candle_pane" });
                } catch {
                    // last resort: ignore
                }
            }
        }
    }, [showBB, data, bbOptions, figures]);

    return (
        <div className="w-full rounded-2xl border border-gray-300 bg-white shadow">
            <div ref={containerRef} className="h-[620px] w-full" />
        </div>
    );
}
