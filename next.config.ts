import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  // Allow testing the dev server from a phone on the same hotspot/LAN.
  // 10.109.169.126 = laptop connected to the phone's hotspot (current setup)
  // 192.168.137.1  = laptop hosting its own Windows Mobile Hotspot
  allowedDevOrigins: ["10.109.169.126", "192.168.137.1"],
};

export default nextConfig;
