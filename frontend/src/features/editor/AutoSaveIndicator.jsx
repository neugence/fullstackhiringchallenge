import useEditorStore from '../../store/editorStore'

export default function AutoSaveIndicator() {
    const { isSaving, lastSaved, saveError } = useEditorStore()

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return ''

        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000)

        if (seconds < 10) return 'just now'
        if (seconds < 60) return `${seconds}s ago`

        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`

        const hours = Math.floor(minutes / 60)
        return `${hours}h ago`
    }

    if (saveError) {
        return (
            <div className="save-indicator bg-red-100 text-red-800">
                ⚠️ Save failed
            </div>
        )
    }

    if (isSaving) {
        return (
            <div className="save-indicator saving">
                ⏳ Saving...
            </div>
        )
    }

    if (lastSaved) {
        return (
            <div className="save-indicator saved">
                ✓ Saved {getTimeAgo(lastSaved)}
            </div>
        )
    }

    return null
}
