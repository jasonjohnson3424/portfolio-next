import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
  sassOptions: {
    loadPaths: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "node_modules/bootstrap/scss"),
    ],
    silenceDeprecations: ["legacy-js-api", "import"],
  },
};

export default nextConfig;
