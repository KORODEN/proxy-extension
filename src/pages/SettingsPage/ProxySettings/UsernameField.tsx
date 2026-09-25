import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldProps } from "./FieldProps";

export function UsernameField({ value, onChange, disabled }: FieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="proxy-username">Логин</Label>

            <Input
                id="proxy-username"
                required
                value={value}
                onChange={e => onChange(e.target.value)}
                autoComplete="off"
                disabled={disabled}
            />
        </div>
    );
}
