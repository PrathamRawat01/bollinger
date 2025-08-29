// =========================
'use client'

type Props = { enabled: boolean; onToggle: () => void }
export default function ToggleButton({ enabled, onToggle }: Props) {
    return (
        <button onClick={onToggle} className={`rounded-full px-4 py-2 text-sm ${enabled ? 'bg-blue-600' : 'bg-neutral-700'}`}>
            {enabled ? 'Hide Bollinger' : 'Show Bollinger'}
        </button>
    )
}
