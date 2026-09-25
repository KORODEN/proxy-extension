import { useState } from "react";
import type { FormEvent } from "react";
import { Server } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { HostField } from "./HostField";
import { PortField } from "./PortField";
import { UsernameField } from "./UsernameField";
import { PasswordField } from "./PasswordField";

export const ProxySettings = () => {
    const { proxyServer, saveProxy, proxyError } = useStore();
    const [host, setHost] = useState(proxyServer?.host ?? "");
    const [port, setPort] = useState(String(proxyServer?.port ?? ""));
    const [username, setUsername] = useState(proxyServer?.username ?? "");
    const [password, setPassword] = useState(proxyServer?.password ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            await saveProxy({
                host: host.trim(),
                port: Number(port),
                username,
                password,
            });
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="bg-transparent p-4 border-border">
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-muted-foreground" />

                    <h3 className="text-base">Параметры сервера</h3>
                </div>

                <HostField value={host} onChange={setHost} disabled={saving} />

                <PortField value={port} onChange={setPort} disabled={saving} />

                <UsernameField
                    value={username}
                    onChange={setUsername}
                    disabled={saving}
                />

                <PasswordField
                    value={password}
                    onChange={setPassword}
                    disabled={saving}
                />

                {(error || proxyError) && (
                    <p role="alert" className="text-sm text-destructive">
                        {error || proxyError}
                    </p>
                )}

                <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? "Сохранение…" : "Сохранить"}
                </Button>
            </form>
        </Card>
    );
};
