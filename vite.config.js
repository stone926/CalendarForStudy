import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), legacy()],
	build: {
		rollupOptions: {
			output: {
				format: "iife",
			},
		},
	},
	server: {
		proxy: {
			"/api": {
				//服务器请求域名
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"), //把 src 的别名设置为 @
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				additionalData: `@import "${resolve(__dirname, "src/less/style.less")}";`,
			},
		},
	},
});
