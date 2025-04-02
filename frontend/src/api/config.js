/**
 * API配置文件
 * 管理API请求的基础URL和其他配置
 */

// 默认的开发环境API基础URL
const DEFAULT_DEV_API_URL = "http://localhost:8787";

// 优先从localStorage读取环境变量，然后是环境变量，最后是默认值
// 这允许通过UI动态切换API环境而不需要重启开发服务器
function getApiBaseUrl() {
  // 首先检查localStorage（开发环境和生产环境都检查）
  if (typeof window !== "undefined" && window.localStorage) {
    const storedUrl = localStorage.getItem("vite-api-base-url");
    if (storedUrl) {
      return storedUrl;
    }
  }

  // 检查Cloudflare Pages特定的环境变量（生产环境）
  // Cloudflare Pages在页面全局对象中暴露环境变量
  if (typeof window !== "undefined" && typeof window.VITE_BACKEND_URL !== "undefined") {
    console.log("使用Cloudflare Pages全局环境变量:", window.VITE_BACKEND_URL);
    return window.VITE_BACKEND_URL;
  }

  // 尝试使用Vite的运行时环境变量（适用于Vercel和本地开发）
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    console.log("使用Vite环境变量中的API地址:", envUrl);
    return envUrl;
  }

  // 如果环境变量未设置，输出警告并使用默认值
  console.warn("⚠️ 未找到环境变量VITE_BACKEND_URL，使用默认API地址。请确保在Cloudflare Pages设置了环境变量，并确保设置了'生产环境变量在客户端可用'选项。");
  return DEFAULT_DEV_API_URL;
}

// 获取API基础URL
export const API_BASE_URL = getApiBaseUrl();

// API版本前缀，与后端保持一致
export const API_PREFIX = "/api";

// 完整的API基础URL（包含前缀）
export const getFullApiUrl = (endpoint) => {
  // 如果endpoint已经包含了完整URL，则直接返回
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  // 确保endpoint以/开头
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // 添加API前缀
  return `${API_BASE_URL}${API_PREFIX}${normalizedEndpoint}`;
};

// 导出环境信息方法，便于调试
export const getEnvironmentInfo = () => {
  return {
    apiBaseUrl: API_BASE_URL,
    apiPrefix: API_PREFIX,
    mode: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    viteBuildEnv: import.meta.env.VITE_BACKEND_URL || "未设置",
    cfPagesEnv: typeof window !== "undefined" ? window.VITE_BACKEND_URL || "未设置" : "未在浏览器环境",
  };
};
