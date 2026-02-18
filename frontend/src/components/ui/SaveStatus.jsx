function SaveStatus({ status }) {
    const labels = {
        idle: "",
        saving: "Saving...",
        saved: "Saved",
        error: "Save failed",
    };

    const colors = {
        idle: "text-transparent",
        saving: "text-neutral-400",
        saved: "text-green-600",
        error: "text-red-500",
    };

    return (
        <span className={`text-xs font-medium ${colors[status] || ""}`}>
            {labels[status] || ""}
        </span>
    );
}

export default SaveStatus;
