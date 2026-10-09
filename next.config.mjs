/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/ikigai.airdna_en_j",
        destination: "/AirDNA_en_Aug2026_George.pdf",
        permanent: true,
      },
      {
        source: "/ikigai.airdna_en_m",
        destination: "/AirDNA_en_Aug2026_Mikhael.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
