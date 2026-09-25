import { create } from "zustand";

import { chromeService } from "../services/chromeService";

import type { ProxyServer } from "../services/chromeService";

export const MAIN_PAGE = "main";
export const SETTINGS_PAGE = "settings";

export type Page = typeof MAIN_PAGE | typeof SETTINGS_PAGE;

type AppState = {
    vpnEnabled: boolean;
    loading: boolean;
    currentHost: string;
    proxyServer?: ProxyServer;
    error?: string;
    proxyError?: string;
    busy: boolean;
    saveProxy: (server: ProxyServer) => Promise<void>;

    currentPage: Page;
    setCurrentPage: (page: Page) => void;

    init: () => void;
    toggleVPN: () => void;
};

export const useStore = create<AppState>(set => ({
    vpnEnabled: false,
    loading: true,
    busy: false,
    currentHost: "",
    currentPage: MAIN_PAGE,

    setCurrentPage(page) {
        set({ currentPage: page });
    },

    async init() {
        try {
            const { host, vpnEnabled, proxyServer, proxyError } =
                await chromeService.getInitialData();

            set({
                currentHost: host,
                vpnEnabled,
                loading: false,
                proxyServer,
                proxyError: proxyError || undefined,
                currentPage:
                    proxyServer && !proxyError ? MAIN_PAGE : SETTINGS_PAGE,
            });
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },

    async saveProxy(server) {
        const { proxyServer, vpnEnabled } =
            await chromeService.saveProxy(server);

        set({
            proxyServer,
            vpnEnabled,
            currentPage: MAIN_PAGE,
            error: undefined,
        });
    },

    async toggleVPN() {
        set({ busy: true, error: undefined });

        try {
            const { vpnEnabled } = await chromeService.toggleVPN();

            set({ vpnEnabled });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ busy: false });
        }
    },
}));
