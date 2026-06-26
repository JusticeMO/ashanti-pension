import React from "react";

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outline-green" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-full cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-[#C49A45] hover:bg-[#A37F35] text-white border-2 border-transparent shadow-[0_4px_16px_rgba(196,154,69,0.2)]",
    secondary: "bg-[#094029] hover:bg-[#0C5535] text-white border-2 border-transparent",
    outline: "bg-transparent hover:bg-[#C49A45] text-[#C49A45] hover:text-white border-2 border-[#C49A45]",
    "outline-green": "bg-transparent hover:bg-[#094029] text-[#094029] hover:text-white border-2 border-[#094029]",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// --- Card ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "elevated" | "gold" | "green" }> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const styles = {
    default: "bg-white rounded-2xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md",
    elevated: "bg-white rounded-3xl shadow-md border border-[#094029]/[0.04]",
    gold: "bg-white rounded-2xl shadow-sm border border-slate-200/80 border-t-4 border-t-[#C49A45]",
    green: "bg-white rounded-2xl shadow-sm border border-slate-200/80 border-l-4 border-l-[#094029]",
  };

  return (
    <div className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 flex flex-col gap-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => (
  <h3 className={`text-xl font-bold font-serif text-slate-900 leading-none ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-slate-500 font-sans ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 flex items-center border-t border-slate-100/80 ${className}`} {...props}>
    {children}
  </div>
);

// --- Badge ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "green" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "", ...props }) => {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    gold: "bg-[#FBF6EC] text-[#A37F35]",
    green: "bg-[#ECFAF2] text-[#094029]",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/50",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/50",
    info: "bg-blue-50 text-blue-700 border border-blue-200/50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full font-sans tracking-wide ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// --- Input & Label ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 font-sans text-sm text-slate-900 bg-white border border-slate-300 rounded-xl outline-none transition-all focus:border-[#094029] focus:ring-4 focus:ring-[#094029]/10 placeholder:text-slate-400 ${
          error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""
        } ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = "", ...props }) => (
  <label className={`block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 font-sans ${className}`} {...props}>
    {children}
  </label>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = "", error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-4 py-3 font-sans text-sm text-slate-900 bg-white border border-slate-300 rounded-xl outline-none transition-all focus:border-[#094029] focus:ring-4 focus:ring-[#094029]/10 ${
          error ? "border-rose-500 focus:border-rose-500" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
