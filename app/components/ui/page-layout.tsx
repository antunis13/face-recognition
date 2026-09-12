import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightActions?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const PageHeader = ({
  title,
  rightActions,
  subtitle,
  className,
  children,
}: PageHeaderProps) => {
  return (
    <div className={cn("px-8 pt-6 pb-3 bg-white", className)}>
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

        {rightActions && <div>{rightActions}</div>}
      </div>

      {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className }: PageLayoutProps) => (
  <div className={cn("min-h-full", className)}>{children}</div>
);

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export const PageContent = ({ children, className }: PageContentProps) => (
  <div className={cn("px-8 pb-6 pt-3 h-full", className)}>{children}</div>
);
