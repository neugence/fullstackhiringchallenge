const colors = {
    draft: "bg-amber-100 text-amber-800",
    published: "bg-green-100 text-green-800",
    default: "bg-neutral-100 text-neutral-700",
};

function Badge({ status = "default", children }) {
    const color = colors[status] || colors.default;

    return (
        <span
            className={`
                inline-flex items-center px-2 py-0.5
                text-xs font-medium rounded-full capitalize
                ${color}
            `}
        >
            {children || status}
        </span>
    );
}

export default Badge;
