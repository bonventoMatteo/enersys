import './globals.css';

export const metadata = { title: 'ENERSYS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`dark`}>
      <body className="bg-[#0F1115] text-slate-300 antialiased selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}