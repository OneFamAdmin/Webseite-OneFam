#!/bin/bash
# Waechter: meldet sich, sobald eine Antwort von Shirt-King/Heldenwerbung eintrifft.
#
# Warum es das gibt (21.09.2026): Vier Nachrichten sind an Robert Koch (Mail) und
# an HW-Christian (PodOS-Chat) raus, alle warten auf Antwort. Christians
# Chat-Antworten loesen eine Benachrichtigungsmail von Heldenwerbung aus — beides
# laeuft also ueber dasselbe Postfach und laesst sich gemeinsam ueberwachen.
#
# Mail.app ist per osascript vom Terminal aus erreichbar (geprueft 21.09.2026);
# ~/Library/Mail direkt zu lesen scheitert dagegen an TCC ("Operation not
# permitted"). Deshalb der Umweg ueber AppleScript.
#
# Die Basislinie wird beim Start selbst gemessen — kein Nachpflegen noetig.
#
# Aufruf (im Hintergrund laufen lassen):
#     bash tools/postfach-waechter.sh
#
# Er beendet sich, sobald etwas eintrifft, und meldet was.

STUNDEN=${1:-14}

messen() {
  osascript <<'OSA' 2>/dev/null
tell application "Mail"
	set tKonto to first account whose name is "T-Online"
	set pf to mailbox "INBOX" of tKonto
	set nRobert to (count of (every message of pf whose sender contains "robert.koch"))
	set nHW to (count of (every message of pf whose sender contains "heldenwerbung" or sender contains "shirt-king"))
	return (nRobert as string) & " " & (nHW as string)
end tell
OSA
}

BASIS=$(messen)
BASIS_ROBERT=$(echo "$BASIS" | awk '{print $1}')
BASIS_HW=$(echo "$BASIS" | awk '{print $2}')

if [ -z "$BASIS_ROBERT" ]; then
  echo "FEHLER: Mail.app antwortet nicht. Laeuft sie, und ist das T-Online-Konto eingerichtet?"
  exit 1
fi

echo "Waechter gestartet. Basislinie: Robert=$BASIS_ROBERT, Heldenwerbung/PodOS=$BASIS_HW. Laufzeit ${STUNDEN}h."

ENDE=$((SECONDS + STUNDEN * 3600))
while [ $SECONDS -lt $ENDE ]; do
  sleep 300
  AUS=$(messen)
  R=$(echo "$AUS" | awk '{print $1}')
  H=$(echo "$AUS" | awk '{print $2}')
  [ -z "$R" ] && continue
  if [ "$R" -gt "$BASIS_ROBERT" ] 2>/dev/null; then
    echo "NEUE MAIL VON ROBERT ($R statt $BASIS_ROBERT) — vermutlich Antwort zu Stick/DTF oder zur Ausfuehrer-Anfrage"
    exit 0
  fi
  if [ "$H" -gt "$BASIS_HW" ] 2>/dev/null; then
    echo "NEUE NACHRICHT VON HELDENWERBUNG/PODOS ($H statt $BASIS_HW) — vermutlich Christians Antwort im Chat"
    exit 0
  fi
done
echo "WAECHTER ABGELAUFEN nach ${STUNDEN}h — keine Antwort eingegangen"
