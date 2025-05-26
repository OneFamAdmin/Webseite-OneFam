
// utils setLanguage.ts
import Cookies from "js-cookie";

//import { Cookies } from "next/headers";

const setLanguage = async (lang: string) => {
  //const cookieStore = await cookies();
  //cookieStore.set("NEXT_LOCALE", lang); // Set the locale cookie
  Cookies.set("NEXT_LOCALE", lang); // Set the locale cookie for client-side access
};

export default setLanguage;

