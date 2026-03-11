"use client";

import { CheckCircle2, Eye, EyeClosed, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const title = "Password field";

export interface PasswordValidationRule {
  /** Label shown next to the rule (e.g. "At least 8 characters"). */
  text: string;
  /** Returns true when the password satisfies this rule. */
  validate: (value: string) => boolean;
}

export interface PasswordValidationInputProps {
  /** Custom validation rules. Each rule has a label and a validator function. */
  validations: PasswordValidationRule[];
  /** Label text for the input (default: "Password"). */
  label?: string;
  /** Input placeholder (default: "Enter password"). */
  placeholder?: string;
  /** Id for the input element (default: "password"). */
  inputId?: string;
  /** Optional class name for the root container. */
  className?: string;
}

function getStrengthColor(score: number) {
  if (score === 0) return "bg-muted";
  if (score <= 1) return "bg-red-500";
  if (score <= 2) return "bg-orange-500";
  if (score <= 3) return "bg-green-600 dark:bg-green-400";
  return "bg-green-600 dark:bg-green-500";
}

function getStrengthText(score: number) {
  if (score === 0) return "";
  if (score <= 1) return "Weak";
  if (score <= 2) return "Moderate";
  if (score <= 3) return "Strong";
  return "Very Strong";
}

function getStrengthTextColor(score: number) {
  if (score === 0) return "text-muted-foreground";
  if (score <= 1) return "text-red-500";
  if (score <= 2) return "text-orange-500";
  if (score <= 3) return "text-green-600 dark:text-green-400";
  return "text-green-600 dark:text-green-500";
}

export function PasswordValidationInput({
  validations,
  label = "Password",
  placeholder = "Enter password",
  inputId = "password",
  className,
}: PasswordValidationInputProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const results = validations.map((rule) => ({
    text: rule.text,
    valid: rule.validate(password),
  }));
  const strength = results.filter((r) => r.valid).length;

  return (
    <div className={cn("w-full max-w-sm space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor={inputId}>{label}</Label>
        <div className="relative">
          <Input
            className="bg-transparent"
            id={inputId}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <Button
            className="absolute top-0 right-0 h-full cursor-pointer px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            size="icon"
            type="button"
            variant="ghost"
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeClosed className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full transition-all duration-500 ease-out ${getStrengthColor(strength)}`}
            style={{ width: `${(strength / validations.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between font-medium text-xs">
          <span className="text-muted-foreground">Password must contain</span>
          <span className={getStrengthTextColor(strength)}>
            {getStrengthText(strength)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        {results.map((result, index) => (
          <div
            className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
              result.valid
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }`}
            key={index}
          >
            {result.valid ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            <span className="text-[13px]">{result.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const HAS_DIGIT = /\d/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_SPECIAL = /[!@#$%^&*]/;

const defaultValidations: PasswordValidationRule[] = [
  { text: "At least 8 characters", validate: (v) => v.length >= 8 },
  { text: "Contains a number", validate: (v) => HAS_DIGIT.test(v) },
  { text: "Contains uppercase letter", validate: (v) => HAS_UPPERCASE.test(v) },
  { text: "Contains special character", validate: (v) => HAS_SPECIAL.test(v) },
];

const InputRealTimeValidationDemo = () => (
  <PasswordValidationInput validations={defaultValidations} />
);

export default InputRealTimeValidationDemo;
