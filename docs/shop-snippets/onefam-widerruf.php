<?php
/*
 * Shop-Snippet 116 "OneFam Widerrufsfunktion (Empfang)"
 * Angelegt am 21.11.2026. Diese Datei ist die Quelle; im Shop steht derselbe
 * Code ohne die erste Zeile.
 *
 * POST /wp-json/onefam/v1/widerruf
 *
 * Nimmt die Online-Widerrufserklaerung entgegen, die Art. 11a der Richtlinie
 * 2011/83/EU verlangt, wo ein Widerrufsrecht besteht (eingefuegt durch die
 * Richtlinie (EU) 2023/2673, anzuwenden seit 19.06.2026; Deutschland § 356a BGB):
 *   Abs. 2  Der Verbraucher nennt seinen Namen, den Vertrag und den
 *           elektronischen Weg fuer die Bestaetigung.
 *   Abs. 4  Der Unternehmer schickt unverzueglich eine Eingangsbestaetigung auf
 *           einem dauerhaften Datentraeger, mit dem Inhalt der Erklaerung sowie
 *           Datum und Uhrzeit des Eingangs.
 * Das Formular steht auf onefam.ch (/widerruf, components/shop/WiderrufAnsicht.tsx)
 * und spricht diese Adresse direkt aus dem Browser an - so sieht der Shop die
 * echte IP und kann bremsen (derselbe Weg wie die Warteliste, Snippet 18).
 *
 * WAS DER EMPFANG TUT - und was bewusst nicht:
 * - Er nimmt JEDE vollstaendige Erklaerung an und bestaetigt den Eingang. Er
 *   prueft NICHT, ob ein Widerrufsrecht besteht oder die Frist noch laeuft: Die
 *   Erklaerung gilt mit dem Absenden als abgegeben (Art. 11a Abs. 5), die
 *   Pruefung macht ein Mensch. Die Bestaetigung sagt deshalb nur "eingegangen".
 * - Passen Bestellnummer UND E-Mail zu einer Bestellung, steht der Eingang als
 *   interne Notiz an der Bestellung und im Feld _onefam_widerruf_eingang.
 *   Passen sie nicht, geht die Erklaerung trotzdem per Mail an den Shop. Die
 *   Antwort an den Absender ist in beiden Faellen dieselbe - sie verraet nicht,
 *   ob es die Bestellung gibt.
 * - Bremse: 5 Erklaerungen je IP und Stunde, 40 insgesamt je Stunde. Jede
 *   Erklaerung loest zwei Mails aus; ohne Bremse waere das Formular ein
 *   Mailversender fuer Fremde. Wer an der Bremse haengt, bekommt 429 und auf der
 *   Seite den Hinweis, per E-Mail zu widerrufen - das gilt genauso.
 * - Es geht EINE Mail hinaus: die Eingangsbestaetigung an den Absender, als
 *   Blindkopie an den Shop (Empfaenger der Mail "Neue Bestellung"). Gemessen am
 *   21.11.2026: Der Shop versendet ueber PHP mail() (FluentSMTP, Verbindung
 *   "PHP mail()"). Von ZWEI Mails in derselben Anfrage kam die zweite nie an,
 *   obwohl das Protokoll "sent" meldete, und die Anfrage dauerte rund 17 s. Mit
 *   EINER Mail und Blindkopie kamen beide Fassungen an, Antwort nach 1,3 s.
 *   Die Blindkopie ist zugleich der Beleg, was der Kunde erhalten hat.
 * - Zweite Spur neben der Mail: WooCommerce > Status > Protokolle, Quelle
 *   "onefam-widerruf". Dort steht auch, ob die Bestellung gefunden wurde.
 * - Datum und Uhrzeit stehen in Schweizer Zeit. WordPress selbst laeuft auf
 *   UTC ohne Ortsangabe; "01:00 GMT+0000" laese ein Kunde in Basel als falsche
 *   Uhrzeit.
 *
 * Kein JavaScript in diesem Snippet.
 */

add_action( 'rest_api_init', function () {
	register_rest_route( 'onefam/v1', '/widerruf', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'onefam_widerruf_annehmen',
	) );
} );

function onefam_widerruf_texte() {
	return array(
		'de' => array(
			'betreff'    => 'Eingangsbestätigung deiner Widerrufserklärung',
			'titel'      => 'Deine Widerrufserklärung ist eingegangen',
			'anrede'     => 'Hallo %s,',
			'einleitung' => 'wir haben deine Widerrufserklärung erhalten. Diese Nachricht bestätigt den Eingang und gibt wieder, was du uns mitgeteilt hast.',
			'eingang'    => 'Eingegangen am',
			'bestellung' => 'Bestellung',
			'name'       => 'Name',
			'email'      => 'E-Mail',
			'umfang'     => 'Erklärung für',
			'alles'      => 'die ganze Bestellung',
			'schluss'    => 'Wir melden uns bei dir mit den nächsten Schritten.',
		),
		'en' => array(
			'betreff'    => 'Acknowledgement of receipt of your withdrawal',
			'titel'      => 'We have received your withdrawal',
			'anrede'     => 'Hello %s,',
			'einleitung' => 'we have received your withdrawal statement. This message confirms receipt and repeats what you told us.',
			'eingang'    => 'Received on',
			'bestellung' => 'Order',
			'name'       => 'Name',
			'email'      => 'Email',
			'umfang'     => 'Statement for',
			'alles'      => 'the whole order',
			'schluss'    => 'We will get back to you with the next steps.',
		),
		'fr' => array(
			'betreff'    => 'Accusé de réception de votre rétractation',
			'titel'      => 'Nous avons bien reçu votre rétractation',
			'anrede'     => 'Bonjour %s,',
			'einleitung' => 'nous avons bien reçu votre déclaration de rétractation. Ce message en accuse réception et reprend ce que vous nous avez communiqué.',
			'eingang'    => 'Reçue le',
			'bestellung' => 'Commande',
			'name'       => 'Nom',
			'email'      => 'E-mail',
			'umfang'     => 'Déclaration pour',
			'alles'      => 'toute la commande',
			'schluss'    => 'Nous reviendrons vers vous pour la suite.',
		),
		'es' => array(
			'betreff'    => 'Acuse de recibo de tu desistimiento',
			'titel'      => 'Hemos recibido tu desistimiento',
			'anrede'     => 'Hola, %s:',
			'einleitung' => 'hemos recibido tu declaración de desistimiento. Este mensaje confirma la recepción y recoge lo que nos has comunicado.',
			'eingang'    => 'Recibida el',
			'bestellung' => 'Pedido',
			'name'       => 'Nombre',
			'email'      => 'Correo electrónico',
			'umfang'     => 'Declaración para',
			'alles'      => 'todo el pedido',
			'schluss'    => 'Nos pondremos en contacto contigo con los siguientes pasos.',
		),
	);
}

function onefam_widerruf_annehmen( WP_REST_Request $anfrage ) {
	// Falle fuer Formular-Roboter: Das Feld ist auf der Seite unsichtbar. Ist es
	// gefuellt, wird nichts getan, aber "ok" geantwortet.
	if ( '' !== trim( (string) $anfrage->get_param( 'website' ) ) ) {
		return rest_ensure_response( array( 'ok' => true ) );
	}

	$name   = sanitize_text_field( (string) $anfrage->get_param( 'name' ) );
	$nummer = sanitize_text_field( (string) $anfrage->get_param( 'bestellung' ) );
	$email  = sanitize_email( (string) $anfrage->get_param( 'email' ) );
	$teile  = sanitize_textarea_field( (string) $anfrage->get_param( 'teile' ) );
	$lang   = (string) $anfrage->get_param( 'lang' );
	$lang   = in_array( $lang, array( 'de', 'en', 'fr', 'es' ), true ) ? $lang : 'en';

	if ( '' === $name || '' === $nummer || mb_strlen( $name ) > 120 || mb_strlen( $nummer ) > 40 || mb_strlen( $teile ) > 600 ) {
		return new WP_Error( 'onefam_eingabe', 'eingabe', array( 'status' => 400 ) );
	}
	if ( '' === $email || ! is_email( $email ) || strlen( $email ) > 254 ) {
		return new WP_Error( 'onefam_email', 'email', array( 'status' => 400 ) );
	}

	// Bremse.
	$ip     = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$k_ip   = 'onefam_wdr_ip_' . md5( $ip );
	$k_alle = 'onefam_wdr_alle';
	$n_ip   = (int) get_transient( $k_ip );
	$n_alle = (int) get_transient( $k_alle );
	if ( $n_ip >= 5 || $n_alle >= 40 ) {
		return new WP_Error( 'onefam_bremse', 'bremse', array( 'status' => 429 ) );
	}
	set_transient( $k_ip, $n_ip + 1, HOUR_IN_SECONDS );
	set_transient( $k_alle, $n_alle + 1, HOUR_IN_SECONDS );

	$jetzt   = time();
	$anzeige = wp_date( 'd.m.Y, H:i:s T', $jetzt, new DateTimeZone( 'Europe/Zurich' ) );
	$texte   = onefam_widerruf_texte();
	$t       = $texte[ $lang ];
	$umfang  = '' !== $teile ? $teile : $t['alles'];

	// Bestellung nur dann anfassen, wenn Nummer UND E-Mail passen.
	$bestellung = null;
	$id         = absint( preg_replace( '/\D+/', '', $nummer ) );
	if ( $id && function_exists( 'wc_get_order' ) ) {
		$kandidat = wc_get_order( $id );
		if ( $kandidat instanceof WC_Order && 0 === strcasecmp( (string) $kandidat->get_billing_email(), $email ) ) {
			$bestellung = $kandidat;
		}
	}
	if ( $bestellung ) {
		$bestellung->add_order_note( sprintf(
			'Widerrufserklärung über das Formular auf onefam.ch eingegangen am %s. Name: %s. Umfang: %s. Noch nicht geprüft.',
			$anzeige,
			$name,
			'' !== $teile ? $teile : 'ganze Bestellung'
		) );
		$bestellung->update_meta_data( '_onefam_widerruf_eingang', gmdate( 'c', $jetzt ) );
		$bestellung->save();
	}

	$zeilen = array(
		$t['eingang'] . ': ' . $anzeige,
		$t['bestellung'] . ': ' . $nummer,
		$t['name'] . ': ' . $name,
		$t['email'] . ': ' . $email,
		$t['umfang'] . ': ' . $umfang,
	);
	$liste = implode( '<br>', array_map( 'esc_html', $zeilen ) );

	$kunde_html = '<p>' . esc_html( sprintf( $t['anrede'], $name ) ) . '</p>'
		. '<p>' . esc_html( $t['einleitung'] ) . '</p>'
		. '<p>' . $liste . '</p>'
		. '<p>' . esc_html( $t['schluss'] ) . '</p>'
		. '<p>OneFam · info@onefam.ch</p>';

	$bestaetigt = false;
	if ( function_exists( 'WC' ) && WC()->mailer() ) {
		$mailer = WC()->mailer();
		$an     = (string) get_option( 'admin_email' );
		$mails  = $mailer->get_emails();
		if ( isset( $mails['WC_Email_New_Order'] ) && $mails['WC_Email_New_Order']->get_recipient() ) {
			$an = $mails['WC_Email_New_Order']->get_recipient();
		}
		$kopf = "Content-Type: text/html\r\n";
		foreach ( array_map( 'trim', explode( ',', $an ) ) as $adresse ) {
			if ( is_email( $adresse ) && 0 !== strcasecmp( $adresse, $email ) ) {
				$kopf .= 'Bcc: ' . $adresse . "\r\n";
			}
		}
		$bestaetigt = (bool) $mailer->send( $email, $t['betreff'] . ' – OneFam', $mailer->wrap_message( $t['titel'], $kunde_html ), $kopf );
	}

	if ( function_exists( 'wc_get_logger' ) ) {
		wc_get_logger()->info(
			sprintf(
				'Widerrufserklaerung %s | Bestellung "%s" (%s) | %s <%s> | Umfang: %s | Sprache %s | Bestaetigung %s',
				$anzeige,
				$nummer,
				$bestellung ? 'gefunden, Notiz gesetzt' : 'NICHT gefunden',
				$name,
				$email,
				'' !== $teile ? $teile : 'ganze Bestellung',
				$lang,
				$bestaetigt ? 'versendet' : 'NICHT versendet'
			),
			array( 'source' => 'onefam-widerruf' )
		);
	}

	$antwort = rest_ensure_response( array(
		'ok'           => true,
		'eingang'      => gmdate( 'c', $jetzt ),
		'anzeige'      => $anzeige,
		// false heisst: Die Mail liess sich nicht absenden. Die Seite zeigt dann den
		// Eingang an und bittet, die Anzeige aufzubewahren.
		'bestaetigung' => $bestaetigt,
	) );
	$antwort->header( 'Cache-Control', 'no-store' );
	return $antwort;
}
