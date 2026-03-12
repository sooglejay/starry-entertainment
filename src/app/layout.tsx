import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '星影娱乐 - 一站式影视娱乐平台',
    template: '%s | 星影娱乐',
  },
  description:
    '星影娱乐为您提供海量高清电影、电视剧、动漫、漫画、小说内容，支持VIP会员订阅、金币充值，享受极致的观影阅读体验。',
  keywords: [
    '在线影视',
    '免费电影',
    '电视剧',
    '动漫',
    '漫画',
    '小说',
    'VIP会员',
    '高清视频',
    '流媒体',
  ],
  authors: [{ name: '星影娱乐 Team' }],
  generator: 'Next.js',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '星影娱乐 - 一站式影视娱乐平台',
    description:
      '海量高清影视、漫画、小说内容，尽在星影娱乐',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isDev && <Inspector />}
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
