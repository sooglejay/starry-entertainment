'use client';

import Link from 'next/link';
import {
  Film,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  MessageCircle,
} from 'lucide-react';

const footerLinks = {
  product: [
    { title: '影视中心', href: '/movies' },
    { title: '漫画频道', href: '/comics' },
    { title: '小说阅读', href: '/novels' },
    { title: '趣味图库', href: '/gallery' },
    { title: '小游戏', href: '/games' },
  ],
  support: [
    { title: '帮助中心', href: '/help' },
    { title: '联系客服', href: '/contact' },
    { title: '意见反馈', href: '/feedback' },
    { title: '举报中心', href: '/report' },
  ],
  about: [
    { title: '关于我们', href: '/about' },
    { title: '用户协议', href: '/terms' },
    { title: '隐私政策', href: '/privacy' },
    { title: '版权声明', href: '/copyright' },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">星影娱乐</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              一站式影视娱乐平台，汇聚海量电影、电视剧、动漫、漫画、小说内容，
              为您提供极致的观影阅读体验。
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">产品</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-semibold mb-4">关于</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@xingying.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>400-888-8888</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>北京市朝阳区xxx路xxx号</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 星影娱乐. All rights reserved.</p>
          <p className="mt-1">
            京ICP备xxxxxxxx号-1 | 京公网安备xxxxxxxxxxxxxx号
          </p>
        </div>
      </div>
    </footer>
  );
}
