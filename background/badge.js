import { getStatusIcon } from "./icons.js";

export async function updateBadge() {
    const data = await chrome.storage.local.get(["vpnEnabled", "proxyError"]);
    const vpnEnabled = !!data.vpnEnabled;

    const status = !vpnEnabled
        ? "disabled"
        : data.proxyError
          ? "error"
          : "enabled";

    await chrome.action.setIcon({ imageData: getStatusIcon(status) });

    await chrome.action.setBadgeText({ text: "" });

    await chrome.action.setTitle({
        title: !vpnEnabled
            ? "Прокси выключен"
            : data.proxyError || "Прокси включён",
    });
}
