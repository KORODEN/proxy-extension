import { ChevronLeft } from "lucide-react";

import { MAIN_PAGE, useStore } from "@/store";

import { ProxySettings } from "./ProxySettings";

export function SettingsPage() {
    const { setCurrentPage, proxyServer } = useStore();

    return (
        <div className="p-4 space-y-4">
            {proxyServer && (
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <button
                        onClick={() => setCurrentPage(MAIN_PAGE)}
                        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <div>
                        <h1 className="text-foreground text-base">Настройки</h1>

                        <p className="text-muted-foreground text-sm mt-0.5">
                            Конфигурация прокси
                        </p>
                    </div>
                </div>
            )}

            <ProxySettings />
        </div>
    );
}
