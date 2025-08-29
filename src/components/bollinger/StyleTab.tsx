import type { BBSettings } from "@/lib/types";

export default function StyleTab({
    settings,
    setSettings,
}: {
    settings: BBSettings;
    setSettings: (s: BBSettings) => void;
}) {
    const handleStyleChange = (
        band: "upper" | "middle" | "lower",
        key: keyof BBSettings["style"]["upper"],
        value: any
    ) => {
        setSettings({
            ...settings,
            style: { ...settings.style, [band]: { ...settings.style[band], [key]: value } },
        });
    };

    const handleFillChange = (key: keyof BBSettings["style"]["fill"], value: any) => {
        setSettings({
            ...settings,
            style: { ...settings.style, fill: { ...settings.style.fill, [key]: value } },
        });
    };

    return (
        <div className="space-y-4">
            {(["upper", "middle", "lower"] as const).map((band) => (
                <div key={band}>
                    <h3 className="font-semibold text-gray-800 capitalize">{band} band</h3>
                    <label className="flex items-center">
                        <span className="w-32">Visible:</span>
                        <input
                            type="checkbox"
                            checked={settings.style[band].visible}
                            onChange={(e) => handleStyleChange(band, "visible", e.target.checked)}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        <span className="w-32">Color:</span>
                        <input
                            type="color"
                            value={settings.style[band].color}
                            onChange={(e) => handleStyleChange(band, "color", e.target.value)}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        <span className="w-32">Width:</span>
                        <input
                            type="number"
                            min="1"
                            value={settings.style[band].width}
                            onChange={(e) => handleStyleChange(band, "width", Number(e.target.value))}
                            className="ml-2 bg-gray-100 border border-gray-300 rounded px-2 py-1 w-20 text-gray-800"
                        />
                    </label>
                    <label className="flex items-center">
                        <span className="w-32">Style:</span>
                        <select
                            value={settings.style[band].lineStyle}
                            onChange={(e) => handleStyleChange(band, "lineStyle", e.target.value as "solid" | "dashed")}
                            className="ml-2 bg-gray-100 border border-gray-300 rounded px-2 py-1 w-32 text-gray-800"
                        >
                            <option>solid</option>
                            <option>dashed</option>
                        </select>
                    </label>
                </div>
            ))}
            <div>
                <h3 className="font-semibold text-gray-800">Fill</h3>
                <label className="flex items-center">
                    <span className="w-32">Visible:</span>
                    <input
                        type="checkbox"
                        checked={settings.style.fill.visible}
                        onChange={(e) => handleFillChange("visible", e.target.checked)}
                        className="ml-2"
                    />
                </label>
                <label className="flex items-center">
                    <span className="w-32">Color:</span>
                    <input
                        type="color"
                        value={settings.style.fill.color}
                        onChange={(e) => handleFillChange("color", e.target.value)}
                        className="ml-2"
                    />
                </label>
                <label className="flex items-center">
                    <span className="w-32">Opacity:</span>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.style.fill.opacity}
                        onChange={(e) => handleFillChange("opacity", Number(e.target.value))}
                        className="ml-2 bg-gray-100 border border-gray-300 rounded px-2 py-1 w-20 text-gray-800"
                    />
                </label>
            </div>
        </div>
    );
}