import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { FieldLabel } from "./FieldLabel";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn("grow flex items-center gap-2", className)}>
      {label && <FieldLabel label={label} />}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
