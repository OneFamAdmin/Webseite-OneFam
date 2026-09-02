# Shop: Fuss- und Menuelinks verlieren die Sprache

Gemessen am 02.09.2026, ausgeloggt, ohne Query-Parameter.

## Der Befund

Auf `shop.onefam.ch/de/` sind die Beschriftungen im Fuss deutsch, die
**Adressen dahinter aber englisch**. Zwei Links bekommen das Sprachpraefix,
sieben nicht:

| Beschriftung | zeigt heute auf | richtig waere |
|---|---|---|
| Datenschutz | `/de/privacy-policy/` | ✅ stimmt |
| Impressum | `/de/legal-notice/` | ✅ stimmt |
| Rueckgabe | `/refund-policy/` | `/de/refund-policy/` |
| Versand | `/shipping-policy/` | `/de/shipping-policy/` |
| AGB | `/terms-of-service/` | `/de/terms-of-service/` |
| Kontaktinformationen | `/contact-information/` | `/de/contact-information/` |
| Kontakt | `/contact-us/` | `/de/contact-us/` |
| Ueber uns | `/about-us/` | `/de/about-us/` |
| Nach Land shoppen | `/shop-by-country/` | `/de/shop-by-country/` |

Dasselbe auf `/fr/` und `/es/`.

**Alle Ziele existieren.** Geprueft am 02.09.2026: `/de/`, `/fr/` und `/es/`
liefern fuer jeden der neun Slugs eine 200.

## Warum das mehr ist als Kosmetik

Wer auf der deutschen Seite auf „AGB" klickt, landet auf einer Adresse ohne
Sprachpraefix. Die Seite uebersetzt sich zwar per JavaScript nach, aber:

- **Ohne JavaScript bleibt sie englisch.** Der Quelltext von
  `/de/refund-policy/` ist englisch; erst ein Skript tauscht die Texte. Wer
  die Widerrufsbelehrung ausdruckt, speichert oder als Beleg braucht, bekommt
  unter Umstaenden die englische Fassung.
- **Die geteilte Adresse ist die falsche.** Kopiert jemand den Link aus dem
  Fuss, gibt er die englische Seite weiter.
- Suchmaschinen sehen fuer die deutsche Seite Links auf die englische.

## Wo es NICHT herkommt

`links(l)` im i18n-Skript fasst nur Adressen an, die auf `.html` enden, und
haengt dort `?lang=` an. Mit dem Sprachpraefix hat die Funktion nichts zu tun.
Die beiden richtigen Links (Datenschutz, Impressum) werden woanders gesetzt —
diese Stelle ist der Ansatzpunkt, dort fehlen schlicht die uebrigen sieben.

## Beim Beheben beachten

- **Regel 8:** Snippets nur ueber die REST-Schnittstelle speichern. Der
  Formularknopf verwirft programmatisch gesetzten Code stillschweigend, und
  bei 2,4 MB antwortet der Server mit leerem Rumpf — die Fehlermeldung sagt
  nichts darueber aus, ob gespeichert wurde. Danach die Zeichenlaenge im
  Editor nachpruefen.
- **Regel 9:** Kein JavaScript direkt in ein Code-Snippet. Das Plugin schaltet
  den Snippet sonst selbsttaetig ab. Ueber einen eigenen Hook einhaengen.
- Nach der Aenderung **alle drei Sprachen** nachmessen, nicht nur Deutsch, und
  nicht dreimal denselben Link (Regel 3).

## Was dabei noch auffiel

- `shop.onefam.ch/sample-page/` ist oeffentlich erreichbar und indexierbar
  („Sample Page | OneFam") — WordPress-Rest, kann weg.
- Die Rechtstexte gibt es **doppelt**: einmal unter deutschen Slugs (`/agb/`,
  `/versand/`, `/rueckgabe-rueckerstattung/`, `/impressum/`,
  `/datenschutzerklaerung/`) und einmal unter `/de/terms-of-service/` usw.
  Beide Saetze sind live und indexierbar. Zwei Fassungen, die auseinander
  laufen koennen — und im Streitfall ist unklar, welche gilt. Vor dem Launch
  entscheiden, welcher Satz der gueltige ist, und den anderen weiterleiten.
- Im `feat`-Objekt der Startseite fehlt **Andorra**, obwohl es die drei
  Andorra-Produkte gibt. Deshalb zeigt „Ausgewaehlte Laender" nur drei statt
  vier Laender.
