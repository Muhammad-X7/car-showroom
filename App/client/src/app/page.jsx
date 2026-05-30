// src/app/page.jsx  ← ROOT level, not inside [locale]
import { redirect } from "next/navigation";

export default function RootPage() {
    redirect("/ar");
}