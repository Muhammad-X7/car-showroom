// src/app/[locale]/layout.jsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

const LOCALES = ["ar", "en", "ckb"];
const RTL_LOCALES = ["ar", "ckb"];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) notFound();

  // ✅ Must be called before any translations are used
  setRequestLocale(locale);

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