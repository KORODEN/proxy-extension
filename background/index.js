import { setProxy, disableProxy } from "./proxy.js";
import { updateBadge } from "./badge.js";
import { enqueue } from "./queue.js";
import "./auth.js";

export function validateProxy(server) {
    const host = server?.host?.trim();

    if (!host || /[\s\\/@?#]/.test(host)) {
        throw new Error("Введите адрес без протокола и пути");
    }

    let url;

    try {
        url = new URL(`http://${host}`);
    } catch {
        throw new Error("Некорректный адрес сервера");
    }

    if (url.port || (host.includes(":") && !/^\[[\da-f:]+\]$/i.test(host))) {
        throw new Error("Укажите порт в отдельном поле");
    }

    if (
        !Number.isInteger(server.port) ||
        server.port < 1 ||
        server.port > 65535
    ) {
        throw new Error("Порт должен быть целым числом от 1 до 65535");
    }

    if (typeof server.username !== "string" || !server.username.trim()) {
        throw new Error("Введите логин прокси");
    }

    if (typeof server.password !== "string" || !server.password.length) {
        throw new Error("Введите пароль прокси");
    }

    return {
        host: url.hostname,
        port: server.port,
        username: server.username,
        password: server.password,
    };
}

chrome.tabs.onActivated.addListener(updateBadge);
chrome.tabs.onUpdated.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
chrome.runtime.onInstalled.addListener(updateBadge);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (!["toggle", "saveProxy"].includes(message.type)) {
        return;
    }

    enqueue(async () => {
        const data = await chrome.storage.local.get([
            "vpnEnabled",
            "proxyServer",
        ]);

        if (message.type === "saveProxy") {
            const proxyServer = validateProxy(message.proxyServer);

            await chrome.storage.local.set({ proxyServer });

            try {
                if (data.vpnEnabled) {
                    await setProxy(proxyServer);
                }
            } catch (error) {
                if (data.proxyServer) {
                    await chrome.storage.local.set({
                        proxyServer: data.proxyServer,
                    });
                } else {
                    await chrome.storage.local.remove("proxyServer");
                }

                throw error;
            }

            await chrome.storage.local.remove("proxyError");

            await updateBadge();

            return { proxyServer, vpnEnabled: !!data.vpnEnabled };
        }

        const vpnEnabled = !data.vpnEnabled;

        if (vpnEnabled) {
            await setProxy(validateProxy(data.proxyServer));
        } else {
            await disableProxy();
        }

        await chrome.storage.local.set({ vpnEnabled, proxyError: null });

        await updateBadge();

        return { vpnEnabled };
    }).then(sendResponse, error => sendResponse({ error: error.message }));

    return true;
});
