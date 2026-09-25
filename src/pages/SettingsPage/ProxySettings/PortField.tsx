import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldProps } from "./FieldProps";

export function PortField({ value, onChange, disabled }: FieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="proxy-port">Порт</Label>

            <Input
                id="proxy-port"
                type="number"
                min={1}
                max={65535}
                step={1}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="3128"
                required
                disabled={disabled}
            />
        </div>
    );
}
