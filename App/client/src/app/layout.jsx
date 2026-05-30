// src/app/layout.jsx
import "./globals.css";

export const metadata = {
    title: {
        default: "IQCars – Find Your Perfect Car in Iraq",
        template: "%s | IQCars",
    },
    icons: {
        icon: "/favicon_io/favicon.ico",
        shortcut: "/favicon_io/favicon-16x16.png",
        apple: "/favicon_io/apple-touch-icon.png",
    },
    description:
        "Browse thousands of new and used cars for sale in Iraq. Filter by make, model, year and price. Available in English, Arabic, and Kurdish.",
    keywords: ["cars Iraq", "used cars", "new cars", "سيارات العراق", "ئۆتۆمبێل عێراق"],
    openGraph: {
        title: "IQCars – Find Your Perfect Car in Iraq",
        description: "Browse thousands of cars in Iraq.",
        locale: "en_US",
        type: "website",
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full">
            <head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="min-h-full flex flex-col antialiased">
                {children}
            </body>
        </html>
    );
}