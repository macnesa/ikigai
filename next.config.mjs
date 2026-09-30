/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/ikigai.airdna_en_j",
        destination:
          "https://cdn.shopify.com/s/files/1/0674/1590/0291/files/AirDNA_en_Aug2026_Jevon.pdf",
        permanent: true,
      },
      {
        source: "/ikigai.airdna_en_m",
        destination:
          "https://cdn.shopify.com/s/files/1/0674/1590/0291/files/AirDNA_en_Aug2026_Mikhael.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;