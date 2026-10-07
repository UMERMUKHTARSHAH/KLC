// vite.config.js
import { defineConfig } from "file:///C:/Users/Asus/KaniAdvanced/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Asus/KaniAdvanced/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/shopify/admin": {
        // More specific proxy path
        target: "https://kashmir-loom.myshopify.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shopify\/admin/, "/admin")
      }
    },
    // IMPORTANT: This handles SPA routing
    historyApiFallback: true
  },
  optimizeDeps: {
    include: ["jwt-decode"]
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBc3VzXFxcXEthbmlBZHZhbmNlZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQXN1c1xcXFxLYW5pQWR2YW5jZWRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FzdXMvS2FuaUFkdmFuY2VkL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL3Nob3BpZnkvYWRtaW5cIjogeyAgLy8gTW9yZSBzcGVjaWZpYyBwcm94eSBwYXRoXHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8va2FzaG1pci1sb29tLm15c2hvcGlmeS5jb21cIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9zaG9waWZ5XFwvYWRtaW4vLCBcIi9hZG1pblwiKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gSU1QT1JUQU5UOiBUaGlzIGhhbmRsZXMgU1BBIHJvdXRpbmdcclxuICAgIGhpc3RvcnlBcGlGYWxsYmFjazogdHJ1ZVxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbJ2p3dC1kZWNvZGUnXVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1EsU0FBUyxvQkFBb0I7QUFDclMsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLGtCQUFrQjtBQUFBO0FBQUEsUUFDaEIsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxxQkFBcUIsUUFBUTtBQUFBLE1BQzdEO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxvQkFBb0I7QUFBQSxFQUN0QjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFlBQVk7QUFBQSxFQUN4QjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNuQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
