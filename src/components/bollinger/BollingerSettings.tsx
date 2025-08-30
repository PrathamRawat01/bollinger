"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { BBOptions } from "@/lib/types"

type Props = {
    settings: BBOptions
    onChange: (s: BBOptions) => void
    showBB: boolean
    onToggleBB: (v: boolean) => void
}

export function BollingerSettings({ settings, onChange, showBB, onToggleBB }: Props) {
    const [tab, setTab] = useState<"inputs" | "style">("inputs")

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col h-full text-gray-900 bg-white/30 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20"
        >
            {/* Tabs */}
            <div className="flex border-b border-gray-300 mb-4 relative">
                {["inputs", "style"].map(t => (
                    <button
                        key={t}
                        className={`flex-1 p-2 text-sm font-medium relative z-10 ${tab === t ? "text-blue-600" : "text-gray-600"}`}
                        onClick={() => setTab(t as "inputs" | "style")}
                    >
                        {t[0].toUpperCase() + t.slice(1)}
                    </button>
                ))}

                {/* Animated underline */}
                <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 h-[2px] bg-blue-600"
                    initial={false}
                    animate={{
                        left: tab === "inputs" ? "0%" : "50%",
                        width: "50%",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Show Bollinger Bands</span>
                <motion.button
                    onClick={() => onToggleBB(!showBB)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${showBB ? "bg-blue-600" : "bg-gray-300"}`}
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                        animate={{ x: showBB ? 20 : 2 }}
                    />
                </motion.button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1">
                <AnimatePresence mode="wait">
                    {tab === "inputs" && (
                        <motion.div
                            key="inputs"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-3"
                        >
                            <label className="flex justify-between text-sm">
                                Length
                                <input
                                    type="number"
                                    value={settings.length}
                                    onChange={e => onChange({ ...settings, length: +e.target.value })}
                                    className="border rounded px-2 w-20"
                                />
                            </label>

                            <label className="flex justify-between text-sm">
                                Source
                                <select
                                    value={settings.source}
                                    onChange={e => onChange({ ...settings, source: e.target.value as BBOptions["source"] })}
                                    className="border rounded px-2"
                                >
                                    <option value="open">Open</option>
                                    <option value="high">High</option>
                                    <option value="low">Low</option>
                                    <option value="close">Close</option>
                                </select>
                            </label>

                            <label className="flex justify-between text-sm">
                                MA Type
                                <select
                                    value={settings.maType}
                                    onChange={e => onChange({ ...settings, maType: e.target.value as BBOptions["maType"] })}
                                    className="border rounded px-2"
                                >
                                    <option value="SMA">SMA</option>
                                    <option value="EMA">EMA</option>
                                </select>
                            </label>

                            <label className="flex justify-between text-sm">
                                Multiplier
                                <input
                                    type="number"
                                    value={settings.multiplier}
                                    onChange={e => onChange({ ...settings, multiplier: +e.target.value })}
                                    className="border rounded px-2 w-20"
                                />
                            </label>

                            <label className="flex justify-between text-sm">
                                Offset
                                <input
                                    type="number"
                                    value={settings.offset}
                                    onChange={e => onChange({ ...settings, offset: +e.target.value })}
                                    className="border rounded px-2 w-20"
                                />
                            </label>
                        </motion.div>
                    )}

                    {tab === "style" && (
                        <motion.div
                            key="style"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-3"
                        >
                            {(["basis", "upper", "lower"] as const).map(line => {
                                const showKey = `show${line[0].toUpperCase() + line.slice(1)}` as keyof BBOptions
                                const colorKey = `${line}Color` as keyof BBOptions
                                const widthKey = `${line}Width` as keyof BBOptions
                                const styleKey = `${line}Style` as keyof BBOptions

                                return (
                                    <motion.div
                                        key={line}
                                        className="border p-2 rounded bg-gray-50 shadow-sm"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <label className="flex items-center gap-2 mb-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={settings[showKey] as boolean}
                                                onChange={e =>
                                                    onChange({
                                                        ...settings,
                                                        [showKey]: e.target.checked,
                                                    } as BBOptions)
                                                }
                                            />
                                            Show {line}
                                        </label>

                                        <label className="flex justify-between text-sm">
                                            Color
                                            <input
                                                type="color"
                                                value={settings[colorKey] as string}
                                                onChange={e =>
                                                    onChange({
                                                        ...settings,
                                                        [colorKey]: e.target.value,
                                                    } as BBOptions)
                                                }
                                            />
                                        </label>

                                        <label className="flex justify-between text-sm">
                                            Width
                                            <input
                                                type="number"
                                                value={settings[widthKey] as number}
                                                onChange={e =>
                                                    onChange({
                                                        ...settings,
                                                        [widthKey]: +e.target.value,
                                                    } as BBOptions)
                                                }
                                                className="border rounded px-2 w-20"
                                            />
                                        </label>

                                        <label className="flex justify-between text-sm">
                                            Style
                                            <select
                                                value={settings[styleKey] as string}
                                                onChange={e =>
                                                    onChange({
                                                        ...settings,
                                                        [styleKey]: e.target.value as "solid" | "dashed",
                                                    } as BBOptions)
                                                }
                                                className="border rounded px-2"
                                            >
                                                <option value="solid">Solid</option>
                                                <option value="dashed">Dashed</option>
                                            </select>
                                        </label>
                                    </motion.div>
                                )
                            })}

                            <motion.div
                                className="border p-2 rounded bg-gray-50 shadow-sm"
                                whileHover={{ scale: 1.02 }}
                            >
                                <label className="flex items-center gap-2 mb-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={settings.showBackground}
                                        onChange={e => onChange({ ...settings, showBackground: e.target.checked })}
                                    />
                                    Show Background Fill
                                </label>

                                <label className="flex justify-between text-sm">
                                    Opacity
                                    <input
                                        type="number"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={settings.backgroundOpacity}
                                        onChange={e => onChange({ ...settings, backgroundOpacity: +e.target.value })}
                                        className="border rounded px-2 w-20"
                                    />
                                </label>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
