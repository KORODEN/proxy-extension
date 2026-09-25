import { Settings } from "lucide-react";

import { MainCard } from "@/components/MainCard";
import { SETTINGS_PAGE, useStore } from "@/store";

export function MainPage() {
    const { setCurrentPage, proxyError } = useStore();

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                    <h1 className="text-foreground text-base">Proxy Manager</h1>

                    <p className="text-muted-foreground text-sm mt-0.5">
                        Управление прокси
                    </p>
                </div>

                <button
                    onClick={() => setCurrentPage(SETTINGS_PAGE)}
                    aria-label={
                        proxyError
                            ? "Настройки: ошибка авторизации"
                            : "Настройки"
                    }
                    title={
                        proxyError ? "Проверьте логин и пароль" : "Настройки"
                    }
                    className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    
                    {proxyError && (
                        <span
                            aria-hidden="true"
                            className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"
                        />
                    )}
                </button>
            </div>

            <MainCard />
        </div>
    );
}
