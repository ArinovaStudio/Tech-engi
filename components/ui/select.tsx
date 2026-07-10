"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectClassName?: string;
};

export function CustomSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  disabled = false,
  required = false,
  className,
  selectClassName,
}: CustomSelectProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-900"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            "h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition",
            "focus:border-orange-500 focus:ring-4 focus:ring-orange-100",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            hasError
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 hover:border-slate-300",
            !value ? "text-slate-500" : "text-slate-900",
            selectClassName
          )}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}