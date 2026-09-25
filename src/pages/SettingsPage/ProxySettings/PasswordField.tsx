import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldProps } from "./FieldProps";

export function PasswordField({ value, onChange, disabled }: FieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="space-y-2">
            <Label htmlFor="proxy-password">Пароль</Label>

            <div className="relative">
                <Input
                    id="proxy-password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    autoComplete="off"
                    disabled={disabled}
                    className="pr-10"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={
                        showPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                    aria-controls="proxy-password"
                    title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 cursor-pointer disabled:cursor-default"
                >
                    {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                        <Eye className="size-4" aria-hidden="true" />
                    )}
                </button>
            </div>
        </div>
    );
}
