import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldProps } from "./FieldProps";

export function HostField({ value, onChange, disabled }: FieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="proxy-host">Адрес прокси-сервера</Label>

            <Input
                id="proxy-host"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="proxy.example.com"
                required
                autoComplete="off"
                disabled={disabled}
            />
        </div>
    );
}
