import * as React from "react";

type OptionWrapperProps = {
  title?: string;
  description?: string;
  className?: string;
  /** Exactly one child (e.g., a switch/button) shown on the right */
  children: React.ReactElement;
};

export function OptionWrapper({
  title,
  description,
  className,
  children,
}: OptionWrapperProps) {
  return (
    <div
      className={`
        flex items-center justify-between gap-4
        py-3
        border-b border-clientColors-divider last:border-b-0
        ${className ?? ""}
      `}
      role="listitem"
    >
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-base font-medium leading-tight truncate">
            {title}
          </p>
        )}
        {description && (
          <p className="text-sm opacity-80 mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* right-aligned, single child */}
      <div className="shrink-0 flex items-center">
        {React.Children.only(children)}
      </div>
    </div>
  );
}

export function OptionSection({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-semibold">{title}</h2>}
          {description && (
            <p className="text-sm opacity-80 leading-tight">{description}</p>
          )}
        </div>
      )}
      <div role="list" className="ml-4">
        {children}
      </div>
    </div>
  );
}
