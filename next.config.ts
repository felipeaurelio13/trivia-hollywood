import type { NextConfig } from 'next';

const isGithubPagesBuild =
  process.env.GITHUB_PAGES === 'true' ||
  process.env.STATIC_EXPORT === 'true' ||
  process.env.GITHUB_WORKFLOW === 'Deploy to GitHub Pages';
const repository = process.env.GITHUB_REPOSITORY ?? '';
const repoName = repository.split('/')[1] ?? '';
const basePath = isGithubPagesBuild && repoName ? `/${repoName}` : '';

const nextConfig: NextConfig = {
  output: isGithubPagesBuild ? 'export' : undefined,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isGithubPagesBuild ? 'true' : 'false'
  },
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined
};

export default nextConfig;
