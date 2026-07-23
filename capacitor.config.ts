import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ottertoeic.app",
  appName: "水獺多益單字",
  webDir: "dist-pages",
  server: {
    url: "https://toeic-vocabulary-journal.cfspusa.chatgpt.site",
    cleartext: false,
  },
};

export default config;
