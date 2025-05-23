
// utils setLanguage.ts

"use server";

import { cookies } from "next/headers";

const setLanguage = async (lang: string) => {
  const cookieStore = await cookies(); // Await cookies()
  cookieStore.set("NEXT_LOCALE", lang); // Set the locale cookie
};

export default setLanguage;

