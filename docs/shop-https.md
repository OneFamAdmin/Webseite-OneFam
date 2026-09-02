# Shop: HTTPS erzwingen — was dabei zu wissen ist

Behoben am 02.09.2026. Vorher lieferte `http://shop.onefam.ch` den kompletten
Shop unverschluesselt aus.

## Der Zustand vorher

- `http://shop.onefam.ch/de/` antwortete mit **200** und lieferte eine
  **byte-identische** Kopie der HTTPS-Seite (beide 135'388 Bytes, gleiche
  Pruefsumme). Keine Weiterleitung, auf keinem Pfad.
- `http://shop.onefam.ch/wp-login.php` lieferte das **Anmeldeformular ueber
  Klartext**. Das war der gefaehrlichste Teil.
- HSTS kam nur ueber die HTTPS-Antwort. Wer die Adresse tippte oder einem alten
  Link folgte, war bis zum ersten HTTPS-Besuch ungeschuetzt.

Zum Vergleich: onefam.ch bei Vercel leitet korrekt um, HSTS zwei Jahre.

## Die Loesung war schon da — nur nicht scharf

Im Shop sind **zwei Plugins** installiert: „HTTPS Redirection" und, als dessen
Nachfolger, **„Easy HTTPS & SSL"** (`admin.php?page=ehssl_settings`; die alte
Seite `options-general.php?page=https-redirection` verweist nur noch dorthin).

Der Haken **„Enable Automatic Redirection to HTTPS" war gesetzt** und „Apply
to: The whole domain" ausgewaehlt — und trotzdem passierte nichts.

**Der Grund: das Plugin hatte seinen Block nie in die `.htaccess` geschrieben.**
Ein Klick auf „Aenderungen speichern" hat ihn erzeugt, danach lief die Umleitung
sofort.

> **Merksatz: Ein gesetzter Haken in diesem Plugin heisst nichts.** Massgeblich
> ist, ob der Block `# BEGIN HTTPS Redirection Plugin` in
> `/sites/shop.onefam.ch/.htaccess` steht. Fehlt er, einmal speichern.

## Warum eine selbst gebaute Regel hier scheitert

Vor dem Fund des Plugins wurde eine eigene Regel eingetragen. Sie blieb
wirkungslos. Der Vergleich in derselben Datei zeigt warum:

| | Bedingung |
|---|---|
| Plugin (funktioniert) | `RewriteCond %{HTTP:X-Forwarded-Proto} !https` |
| selbst gebaut (wirkungslos) | `RewriteCond %{HTTP:X-Forwarded-Proto} =http` |

**Infomaniak sendet bei reinem HTTP gar kein `X-Forwarded-Proto`.** Leer ist
nicht `http`, deshalb traf `=http` nie zu. `!https` trifft auch auf „leer" zu.

Und die uebliche Regel aus dem Netz, `RewriteCond %{HTTPS} off`, taugt hier
allein **erst recht nicht**: Infomaniak beendet TLS an einem vorgelagerten Proxy
(die Antwort traegt `vary: X-FORWARDED-PROTO`), `%{HTTPS}` ist also auch bei
HTTPS-Aufrufen off. Wer nur darauf prueft, baut eine **Endlosschleife** und der
Shop ist nicht mehr erreichbar.

## Infomaniak hat dafuer keinen Schalter

Geprueft am 02.09.2026: weder auf der SSL-Seite des Sites noch in den erweiterten
Einstellungen (Reiter „General" und „PHP | Apache") gibt es eine Option, HTTPS zu
erzwingen. Die Produktsuche im Manager findet dazu nichts — sie sucht Produkte,
keine Einstellungen. Es geht nur ueber `.htaccess` oder ein Plugin.

## Der Web-FTP-Editor von Infomaniak hat einen Fehler

Dateien lassen sich ohne FTP-Zugangsdaten ueber **FTP / SSH → Web FTP**
bearbeiten (`ftp.hosting-ik.com`, meldet sich mit der Manager-Sitzung an).

**Das Eintippen der Zeichenfolge `</` bringt den Editor reproduzierbar zum
Absturz** („Uncaught TypeError: Cannot read properties of undefined"). Alles
Ungespeicherte ist dann weg. Ein schliessendes `</IfModule>` also nicht direkt
tippen, sondern `<x/IfModule>` schreiben und das `x` mit Rueckschritt entfernen.

Zwei weitere Eigenheiten:
- Nach dem Laden braucht der Editor ein paar Sekunden, sonst verschluckt er
  Eingaben **stillschweigend** — die Datei sieht danach unveraendert aus.
- Der Stern hinter dem Dateinamen (`.htaccess*`) verschwindet beim Speichern
  verzoegert. Nicht danach urteilen, sondern von aussen messen.

## Was falsch war und nicht noch einmal behauptet werden sollte

`GET /wp-json/` meldet `url` und `home`. Ueber HTTP abgefragt antwortete `url`
mit `http://shop.onefam.ch` — daraus wurde geschlossen, die `siteurl` stehe in
der Datenbank auf http. **Das war falsch.** In wp-admin standen beide Felder auf
`https://shop.onefam.ch`. Die Schnittstelle spiegelt das Schema der eigenen
Anfrage zurueck. Fuer `siteurl` und `home` gilt: in wp-admin nachsehen, nicht in
`wp-json`.

## Pruefbefehle

```bash
# muss 301 auf https liefern, auf jedem Pfad
for u in / /de/ /wp-login.php /de/kasse/ /robots.txt; do
  curl -s -o /dev/null -w "$u -> %{http_code} %{redirect_url}\n" "http://shop.onefam.ch$u"
done

# und https muss ohne Umleitung 200 liefern (sonst Schleife)
curl -s -o /dev/null -w "%{http_code} %{num_redirects}\n" -L --max-redirs 5 https://shop.onefam.ch/de/
```
