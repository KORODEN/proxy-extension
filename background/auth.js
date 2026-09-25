import { updateBadge } from "./badge.js";
import { enqueue } from "./queue.js";

const attempted = new Map();
const normalizeHost = host => host.toLowerCase().replace(/^\[|\]$/g, "");

chrome.webRequest.onAuthRequired.addListener(
    (details, callback) => {
        if (!details.isProxy) {
            callback({});
            return;
        }

        enqueue(async () => {
            const data = await chrome.storage.local.get([
                "vpnEnabled",
                "proxyServer",
            ]);
            const server = data.proxyServer;

            if (
                !data.vpnEnabled ||
                !server?.username ||
                normalizeHost(details.challenger.host) !==
                    normalizeHost(server.host) ||
                details.challenger.port !== server.port
            ) {
                return {};
            }

            const credentialsKey = JSON.stringify(server);
            if (attempted.get(details.requestId) === credentialsKey) {
                try {
                    await chrome.storage.local.set({
                        proxyError: "Неверный логин или пароль",
                    });
                    await updateBadge();
                } catch (error) {
                    console.error(
                        "Не удалось сохранить ошибку авторизации",
                        error,
                    );
                }
                return { cancel: true };
            }

            attempted.set(details.requestId, credentialsKey);

            return {
                authCredentials: {
                    username: server.username,
                    password: server.password || "",
                },
            };
        }).then(callback, () => callback({ cancel: true }));
    },
    { urls: ["<all_urls>"] },
    ["asyncBlocking"],
);

const cleanup = details => attempted.delete(details.requestId);

chrome.webRequest.onCompleted.addListener(cleanup, { urls: ["<all_urls>"] });
chrome.webRequest.onErrorOccurred.addListener(cleanup, {
    urls: ["<all_urls>"],
});
