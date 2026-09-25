export async function setProxy(proxyServer) {
    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "http",
                host: proxyServer.host,
                port: proxyServer.port,
            },
            bypassList: ["<local>"],
        },
    };

    return chrome.proxy.settings.set({ value: config, scope: "regular" });
}

export async function disableProxy() {
    await chrome.proxy.settings.clear({ scope: "regular" });
}
