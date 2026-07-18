import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.meta.title,
    description: c.meta.description,
    metadataBase: new URL("https://vportfolioweb.vercel.app"),
    openGraph: {
      title: c.meta.title,
      description: c.meta.description,
      type: "website",
      locale: "pt_BR",
    },
    twitter: { card: "summary_large_image", title: c.meta.title, description: c.meta.description },
    icons: {
      icon: [
        {
          url:
            "data:image/svg+xml," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230b0b12'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='15' font-weight='700' fill='%238b5cf6'>${c.meta.initials}</text></svg>`
            ),
        },
      ],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#09090e",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
(function(){try{
  var d=document.documentElement;
  d.classList.remove('no-js');
  var t=localStorage.getItem('theme');
  if(t==='light'){d.classList.add('light');d.classList.remove('dark');}
  else{d.classList.add('dark');d.classList.remove('light');}
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark no-js" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
