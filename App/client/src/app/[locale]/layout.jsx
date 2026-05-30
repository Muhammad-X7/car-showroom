// src/app/[locale]/layout.jsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";

const RTL_LOCALES = ["ar", "ckb"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();
  const isRtl = RTL_LOCALES.includes(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        id="locale-root"
        lang={locale}
        dir={isRtl ? "rtl" : "ltr"}
        className="h-full flex flex-col"
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}