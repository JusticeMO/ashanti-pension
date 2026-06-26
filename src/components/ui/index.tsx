import React from "react";

/* ============================================================
   Ashanti Pension — Premium UI Component Library v2
   Apple-quality, Ashanti-branded
   ============================================================ */

// ---- Button ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outline-green" | "ghost" | "danger";
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
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-br from-[#C49A45] to-[#D4AF5F] text-white border-2 border-transparent shadow-[0_4px_20px_rgba(196,154,69,0.32)] hover:from-[#A37F35] hover:to-[#C49A45] hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(196,154,69,0.42)]",
    secondary:
      "bg-gradient-to-br from-[#094029] to-[#0C5535] text-white border-2 border-transparent shadow-[0_4px_16px_rgba(9,64,41,0.22)] hover:from-[#0C5535] hover:to-[#0F6B42] hover:-translate-y-px",
    outline:
      "bg-transparent text-[#A37F35] border-2 border-[#C49A45] hover:bg-[#C49A45] hover:text-white hover:shadow-[0_4px_20px_rgba(196,154,69,0.32)]",
    "outline-green":
      "bg-transparent text-[#094029] border-2 border-[#094029] hover:bg-[#094029] hover:text-white",
    ghost:
      "bg-transparent text-[#4A4540] border-2 border-transparent hover:bg-[#F0EDE8] hover:text-[#1A1714]",
    danger:
      "bg-gradient-to-br from-[#B91C1C] to-[#DC2626] text-white border-2 border-transparent shadow-[0_4px_16px_rgba(185,28,28,0.25)] hover:-translate-y-px",
  };

  const sizes: Record<string, string> = {
    sm: "px-5 py-2 text-[0.6875rem]",
    md: "px-7 py-[11px] text-[0.8125rem]",
    lg: "px-9 py-[14px] text-sm",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 
        font-[family-name:var(--font-heading)] font-semibold 
        uppercase tracking-[0.06em] rounded-full cursor-pointer 
        transition-all duration-[280ms] ease-out
        active:scale-[0.96]
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// ---- Card System ----
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "green" | "success" | "danger" | "flat" | "hero";
}

export const Card: React.FC<CardProps> = ({ children, className = "", variant = "default", ...props }) => {
  const styles: Record<string, string> = {
    default:
      "bg-white/75 backdrop-blur-[20px] border border-white/85 rounded-[20px] shadow-[0_4px_16px_rgba(9,64,41,0.10),0_2px_6px_rgba(9,64,41,0.06)] transition-all duration-[280ms] ease-out hover:shadow-[0_8px_32px_rgba(9,64,41,0.12)]",
    flat:
      "bg-white/75 backdrop-blur-[20px] border border-white/85 rounded-[20px] shadow-[0_2px_8px_rgba(9,64,41,0.08)]",
    gold:
      "bg-white/80 backdrop-blur-[20px] border border-[rgba(196,154,69,0.22)] border-t-[3px] border-t-[#C49A45] rounded-[20px] shadow-[0_4px_16px_rgba(9,64,41,0.10)]",
    green:
      "bg-white/80 backdrop-blur-[20px] border border-[rgba(9,64,41,0.12)] border-l-[3px] border-l-[#0F6B42] rounded-[20px] shadow-[0_4px_16px_rgba(9,64,41,0.10)]",
    success:
      "bg-gradient-to-br from-[rgba(236,250,242,0.92)] to-[rgba(255,255,255,0.82)] backdrop-blur-[20px] border-[1.5px] border-[rgba(9,64,41,0.20)] rounded-[20px] shadow-[0_4px_16px_rgba(9,64,41,0.10)]",
    danger:
      "bg-gradient-to-br from-[rgba(254,242,242,0.92)] to-[rgba(255,255,255,0.82)] backdrop-blur-[20px] border border-[rgba(185,28,28,0.18)] border-t-[3px] border-t-[#B91C1C] rounded-[20px] shadow-[0_2px_8px_rgba(9,64,41,0.08)]",
    hero:
      "bg-gradient-to-br from-[#094029] via-[#0C5535] to-[#0A4D3C] rounded-[20px] shadow-[0_8px_32px_rgba(9,64,41,0.25)]",
  };

  return (
    <div className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children, className = "", ...props
}) => (
  <div className={`p-6 pb-3 flex flex-col gap-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children, className = "", ...props
}) => (
  <h3
    className={`text-[1.0625rem] font-bold leading-snug text-[#1A1714] font-[family-name:var(--font-heading)] ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children, className = "", ...props
}) => (
  <p className={`text-sm text-[#7A746C] leading-relaxed font-[family-name:var(--font-body)] ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children, className = "", ...props
}) => (
  <div className={`p-6 pt-2 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children, className = "", ...props
}) => (
  <div className={`p-6 pt-0 flex items-center border-t border-[#EAE7E0]/60 ${className}`} {...props}>
    {children}
  </div>
);

// ---- Badge ----
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "green" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "", ...props }) => {
  const styles: Record<string, string> = {
    default: "bg-[#F0EDE8] text-[#7A746C] border border-[#EAE7E0]",
    gold:    "bg-[#FBF8F0] text-[#8A6A25] border border-[rgba(196,154,69,0.22)]",
    green:   "bg-[#ECFAF2] text-[#094029] border border-[rgba(9,64,41,0.15)]",
    success: "bg-[#DCFCE7] text-[#14532D] border border-[rgba(21,128,61,0.20)]",
    warning: "bg-[#FEF3C7] text-[#78350F] border border-[rgba(180,83,9,0.20)]",
    danger:  "bg-[#FEE2E2] text-[#7F1D1D] border border-[rgba(185,28,28,0.20)]",
    info:    "bg-[#DBEAFE] text-[#1E3A8A] border border-[rgba(29,78,216,0.20)]",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-[3px]
        text-[0.6875rem] font-bold tracking-[0.06em] uppercase
        font-[family-name:var(--font-heading)] rounded-full whitespace-nowrap
        ${styles[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

// ---- Input ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full px-4 py-[13px]
        font-[family-name:var(--font-body)] text-[0.9375rem] font-normal text-[#1A1714]
        bg-white/90 border-[1.5px] rounded-[14px] outline-none
        transition-all duration-150
        placeholder:text-[#A09890]
        backdrop-blur-[8px]
        ${error
          ? "border-[#B91C1C] shadow-[0_0_0_4px_rgba(185,28,28,0.09)]"
          : "border-[#C8C2BA] focus:border-[#0F6B42] focus:bg-white focus:shadow-[0_0_0_4px_rgba(9,64,41,0.09)]"
        }
        ${className}
      `}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ---- Label ----
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children, className = "", ...props
}) => (
  <label
    className={`
      block mb-1.5
      font-[family-name:var(--font-heading)] text-[0.6875rem] font-bold
      tracking-[0.08em] uppercase text-[#4A4540]
      ${className}
    `}
    {...props}
  >
    {children}
  </label>
);

// ---- Select ----
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = "", error, ...props }, ref) => (
    <select
      ref={ref}
      className={`
        w-full px-4 py-[13px]
        font-[family-name:var(--font-body)] text-[0.9375rem] text-[#1A1714]
        bg-white/90 border-[1.5px] rounded-[14px] outline-none
        transition-all duration-150
        backdrop-blur-[8px]
        ${error
          ? "border-[#B91C1C]"
          : "border-[#C8C2BA] focus:border-[#0F6B42] focus:shadow-[0_0_0_4px_rgba(9,64,41,0.09)]"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

// ---- Stat Card ----
interface StatCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  value: string | number;
  label: string;
  className?: string;
}
export const StatCard: React.FC<StatCardProps> = ({ icon, iconBg = "bg-[#ECFAF2]", value, label, className = "" }) => (
  <div className={`
    flex items-center gap-4 p-5
    bg-white/80 backdrop-blur-[16px] border border-white/90
    rounded-[20px] shadow-[0_2px_8px_rgba(9,64,41,0.08)]
    transition-all duration-[280ms] hover:shadow-[0_4px_16px_rgba(9,64,41,0.12)] hover:-translate-y-0.5
    ${className}
  `}>
    <div className={`${iconBg} p-2.5 rounded-[12px] flex-shrink-0`}>{icon}</div>
    <div className="flex flex-col min-w-0">
      <span className="text-[1.25rem] font-bold text-[#1A1714] font-[family-name:var(--font-heading)] leading-none">
        {value}
      </span>
      <span className="text-[0.6875rem] text-[#A09890] font-bold uppercase tracking-[0.07em] font-[family-name:var(--font-heading)] mt-1">
        {label}
      </span>
    </div>
  </div>
);

// ---- Section Header ----
interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  className?: string;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({ overline, title, subtitle, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {overline && (
      <span className="overline">{overline}</span>
    )}
    <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#1A1714] leading-tight tracking-tight">
      {title}
    </h1>
    {subtitle && (
      <p className="text-sm text-[#7A746C] leading-relaxed font-[family-name:var(--font-body)] max-w-prose">
        {subtitle}
      </p>
    )}
  </div>
);

// ---- Alert Banner ----
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "warning" | "success" | "info";
  icon?: React.ReactNode;
}
export const Alert: React.FC<AlertProps> = ({ children, variant = "error", icon, className = "", ...props }) => {
  const styles: Record<string, string> = {
    error:   "bg-[#FEE2E2] border-[#FECACA] text-[#7F1D1D]",
    warning: "bg-[#FEF3C7] border-[#FDE68A] text-[#78350F]",
    success: "bg-[#DCFCE7] border-[#BBF7D0] text-[#14532D]",
    info:    "bg-[#DBEAFE] border-[#BFDBFE] text-[#1E3A8A]",
  };
  return (
    <div
      className={`flex items-start gap-2.5 p-3.5 rounded-[14px] border text-sm font-medium font-[family-name:var(--font-body)] ${styles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
