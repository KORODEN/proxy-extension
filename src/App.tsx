import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { MainPage } from "@/pages/MainPage";
import { SettingsPage } from "@/pages/SettingsPage";

import { SETTINGS_PAGE, useStore } from "@/store";
import { chromeService } from "@/services/chromeService";

export function App() {
    const { currentPage, init, loading, proxyServer, error } = useStore();

    useEffect(() => {
        init();
        
        return chromeService.subscribeProxyError(proxyError => {
            useStore.setState({ proxyError });
        });
    }, [init]);

    return (
        <ThemeProvider storageKey="ui-theme">
            <div className="w-[360px] bg-background">
                {error && (
                    <p role="alert" className="p-4 text-sm text-destructive">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="p-4">Загрузка…</p>
                ) : currentPage === SETTINGS_PAGE || !proxyServer ? (
                    <SettingsPage />
                ) : (
                    <MainPage />
                )}
            </div>
        </ThemeProvider>
    );
}
