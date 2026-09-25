import assert from "node:assert/strict";
import { test } from "node:test";
import { getStatusIcon } from "../background/icons.js";

// Node has no Canvas. Keep image identities to verify the selected toolbar state.
globalThis.OffscreenCanvas = class {
    getContext() {
        return new Proxy(
            {},
            {
                get: (_, key) =>
                    key === "getImageData" ? () => ({}) : () => {},
            },
        );
    }
};

const listeners = {};
const event = name => ({
    addListener(fn) {
        listeners[name] = fn;
    },
});
let stored = {};
let failProxy = false;
let badgeText = "";
let toolbarIcon;
globalThis.chrome = {
    storage: {
        local: {
            async get() {
                return { ...stored };
            },
            async set(data) {
                Object.assign(stored, data);
            },
            async remove(key) {
                delete stored[key];
            },
        },
    },
    proxy: {
        settings: {
            async set() {
                if (failProxy) throw new Error("Proxy failed");
            },
            async clear() {},
        },
    },
    action: {
        async setBadgeText({ text }) {
            badgeText = text;
        },
        async setIcon({ imageData }) {
            toolbarIcon = imageData;
        },
        async setTitle() {},
    },
    tabs: {
        onActivated: event("activated"),
        onUpdated: event("updated"),
    },
    runtime: {
        onMessage: event("message"),
        onStartup: event("startup"),
        onInstalled: event("installed"),
    },
    webRequest: {
        onAuthRequired: event("auth"),
        onCompleted: event("completed"),
        onErrorOccurred: event("failed"),
    },
};
const { validateProxy } = await import("../background/index.js");
const send = message =>
    new Promise(resolve => listeners.message(message, {}, resolve));
const challenge = (overrides = {}) =>
    new Promise(resolve =>
        listeners.auth(
            {
                isProxy: true,
                requestId: "1",
                challenger: { host: "proxy.example.com", port: 3128 },
                ...overrides,
            },
            resolve,
        ),
    );

test("validation, persistence, failed activation and scoped authentication", async () => {
    for (const host of [
        "",
        "http://proxy.example.com",
        "proxy.example.com:80",
        "proxy.example.com/path",
        "a\\b",
    ]) {
        assert.throws(() => validateProxy({ host, port: 3128 }));
    }
    for (const port of [0, 65536, 1.2, NaN])
        assert.throws(() => validateProxy({ host: "localhost", port }));
    assert.equal(
        validateProxy({
            host: "[::1]",
            port: 80,
            username: "user",
            password: "secret",
        }).host,
        "[::1]",
    );
    assert.ok((await send({ type: "toggle" })).error);
    assert.equal(stored.vpnEnabled, undefined);
    const server = {
        host: "proxy.example.com",
        port: 3128,
        username: "user",
        password: "secret",
    };
    assert.ok(
        (
            await send({
                type: "saveProxy",
                proxyServer: { ...server, username: "" },
            })
        ).error,
    );
    assert.ok(
        (
            await send({
                type: "saveProxy",
                proxyServer: { ...server, password: "" },
            })
        ).error,
    );
    assert.equal(stored.proxyServer, undefined);
    await send({ type: "saveProxy", proxyServer: server });
    assert.deepEqual(stored.proxyServer, server);
    failProxy = true;
    assert.ok((await send({ type: "toggle" })).error);
    assert.equal(stored.vpnEnabled, undefined);
    failProxy = false;
    assert.equal((await send({ type: "toggle" })).vpnEnabled, true);
    // Simulate a browser restart: storage survives, toolbar badge is reset.
    badgeText = "";
    toolbarIcon = undefined;
    await listeners.startup();
    assert.equal(toolbarIcon, getStatusIcon("enabled"));
    assert.equal(badgeText, "");

    badgeText = "";
    await listeners.installed({ reason: "update" });
    assert.equal(toolbarIcon, getStatusIcon("enabled"));
    assert.equal(badgeText, "");
    assert.deepEqual(await challenge({ isProxy: false }), {});
    assert.deepEqual(
        await challenge({
            challenger: { host: "other.example.com", port: 3128 },
        }),
        {},
    );
    assert.deepEqual(
        await challenge({ challenger: { host: server.host, port: 8080 } }),
        {},
    );
    assert.deepEqual(await challenge(), {
        authCredentials: { username: "user", password: "secret" },
    });
    assert.deepEqual(await challenge(), { cancel: true });
    assert.equal(stored.proxyError, "Неверный логин или пароль");
    assert.equal(stored.vpnEnabled, true);
    assert.equal(toolbarIcon, getStatusIcon("error"));
    assert.equal(badgeText, "");

    badgeText = "";
    await listeners.startup();
    assert.equal(toolbarIcon, getStatusIcon("error"));
    assert.equal(badgeText, "");
    listeners.completed({ requestId: "1" });
    assert.ok((await challenge()).authCredentials);
    failProxy = true;
    assert.ok(
        (
            await send({
                type: "saveProxy",
                proxyServer: { ...server, host: "new.example.com" },
            })
        ).error,
    );
    assert.deepEqual(stored.proxyServer, server);
    assert.equal(stored.proxyError, "Неверный логин или пароль");
    failProxy = false;
    // Corrected credentials can be tried even for an existing request.
    const corrected = { ...server, password: "corrected" };
    await send({ type: "saveProxy", proxyServer: corrected });
    assert.equal(stored.proxyError, undefined);
    assert.equal(toolbarIcon, getStatusIcon("enabled"));
    assert.equal(badgeText, "");
    assert.deepEqual(await challenge(), {
        authCredentials: { username: "user", password: "corrected" },
    });
    assert.deepEqual(await challenge(), { cancel: true });
    assert.ok(stored.proxyError);
    await send({ type: "toggle" });
    assert.equal(stored.proxyError, null);
    badgeText = "vpn";
    await listeners.startup();
    assert.equal(badgeText, "");
    assert.equal(toolbarIcon, getStatusIcon("disabled"));
    assert.deepEqual(await challenge(), {});
});
