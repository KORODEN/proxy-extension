export type ProxyServer = {
    host: string;
    port: number;
    username: string;
    password: string;
};

// Keep previously stored authentication errors consistent with the current copy.
const normalizeProxyError = (error?: string | null) =>
    error ===
        "Прокси отклонил авторизацию. Проверьте логин и пароль в настройках." ||
    error === "Ошибка авторизации. Проверьте логин и пароль."
        ? "Неверный логин или пароль"
        : error || undefined;

export const chromeService = {
    async getInitialData() {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        const data = await chrome.storage.local.get([
            "vpnEnabled",
            "proxyServer",
            "proxyError",
        ]);

        const host = tab?.url ? new URL(tab.url).hostname : "";

        return {
            host,
            vpnEnabled: !!data.vpnEnabled,
            proxyServer: data.proxyServer,
            proxyError: normalizeProxyError(data.proxyError),
        };
    },

    subscribeProxyError(onChange: (error?: string) => void) {
        const listener = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === "local" && changes.proxyError) {
                onChange(normalizeProxyError(changes.proxyError.newValue));
            }
        };
        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
    },

    async toggleVPN() {
        const result = await chrome.runtime.sendMessage({ type: "toggle" });

        if (result.error) {
            throw new Error(result.error);
        }

        return result;
    },

    async saveProxy(proxyServer: ProxyServer) {
        const result = await chrome.runtime.sendMessage({
            type: "saveProxy",
            proxyServer,
        });

        if (result.error) {
            throw new Error(result.error);
        }

        return result;
    },
};
