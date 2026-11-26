/** @type {import('next').NextConfig} */
const nextConfig = {
  // 팀 내부 교육자료(콘텐츠의 설계도): public/content-map/index.html 을 /content-map 주소로 연다
  async rewrites() {
    return [{ source: '/content-map', destination: '/content-map/index.html' }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;