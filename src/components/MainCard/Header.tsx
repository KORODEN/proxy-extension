import { Globe } from "lucide-react";

import {
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { useStore } from "@/store";

export function Header() {
    const { vpnEnabled, toggleVPN, busy, proxyError } = useStore();
    
    const hasProxyError = vpnEnabled && !!proxyError;

    return (
        <CardHeader className="p-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Globe
                        className={`w-6 h-6 transition-colors ${hasProxyError ? "text-destructive" : vpnEnabled ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}
                    />

                    {vpnEnabled && !hasProxyError && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
                    )}
                </div>

                <div>
                    <CardTitle className="flex items-center gap-2">
                        <h1 className="text-foreground text-base">Прокси</h1>

                        <Badge
                            variant={
                                hasProxyError
                                    ? "destructive"
                                    : vpnEnabled
                                      ? "success"
                                      : "secondary"
                            }
                        >
                            {hasProxyError
                                ? "Ошибка"
                                : vpnEnabled
                                  ? "Активно"
                                  : "Неактивно"}
                        </Badge>
                    </CardTitle>

                    <CardDescription>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {hasProxyError
                                ? "Ошибка авторизации"
                                : vpnEnabled
                                  ? "Соединение через прокси"
                                  : "Прямое соединение"}
                        </p>
                    </CardDescription>
                </div>
            </div>

            <CardAction className="self-center">
                <Switch
                    disabled={busy}
                    checked={vpnEnabled}
                    onCheckedChange={toggleVPN}
                    variant={hasProxyError ? "destructive" : "success"}
                    aria-label="Использовать прокси"
                />
            </CardAction>
        </CardHeader>
    );
}
