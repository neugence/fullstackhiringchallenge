const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-md hover:-translate-y-0.5",
    secondary: "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5",
    ghost: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
};

const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-5 py-2.5 text-base",
};

function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <button
            className={`
                inline-flex items-center justify-center gap-1.5
                font-medium rounded-md cursor-pointer transition-all duration-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
