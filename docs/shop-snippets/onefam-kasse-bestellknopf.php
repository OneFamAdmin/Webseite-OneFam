<?php
/**
 * OneFam Kasse: Bestellknopf in der Formel des Gesetzes (21.11.2026).
 *
 * Art. 8 Abs. 2 der Richtlinie 2011/83/EU verlangt, dass der Knopf, mit dem bestellt
 * wird, ausschliesslich mit "zahlungspflichtig bestellen" oder einer ebenso
 * eindeutigen Formulierung beschriftet ist. Sonst ist der Kunde an die Bestellung
 * nicht gebunden (Deutschland: es kommt kein Vertrag zustande, § 312j Abs. 4 BGB).
 * WooCommerce beschriftet ihn englisch mit "Place Order", franzoesisch mit
 * "Commander", spanisch mit "Realizar el pedido" - das nennt die Zahlung nicht.
 *
 *   de  § 312j Abs. 3 BGB, § 8 Abs. 2 FAGG (Oesterreich)
 *   fr  Art. L221-14 Code de la consommation
 *   es  Art. 98.2 TRLGDCU
 *   en  reg. 14(4) Consumer Contracts Regulations 2013 (Wortlaut der Richtlinie)
 *
 * Weg: Die Block-Kasse liest die Beschriftung aus dem Attribut
 * placeOrderButtonLabel des Blocks woocommerce/checkout-actions-block. Es wird
 * beim Rendern je Sprache gesetzt - kein JavaScript, keine Aenderung an der Seite.
 * Nicht kuerzen, nichts anhaengen. Dieselben Texte traegt die Kasse auf onefam.ch
 * (messages, shop_kasse.bestellen).
 */
add_filter( 'render_block_data', function ( $block ) {
	if ( ! is_array( $block ) || ( $block['blockName'] ?? '' ) !== 'woocommerce/checkout-actions-block' ) {
		return $block;
	}
	$texte = array(
		'de' => 'Zahlungspflichtig bestellen',
		'en' => 'Order with obligation to pay',
		'fr' => 'Commande avec obligation de paiement',
		'es' => 'Pedido con obligación de pago',
	);
	$lang = function_exists( 'of_visitor_lang' ) ? of_visitor_lang() : substr( (string) determine_locale(), 0, 2 );
	if ( ! isset( $block['attrs'] ) || ! is_array( $block['attrs'] ) ) {
		$block['attrs'] = array();
	}
	$block['attrs']['placeOrderButtonLabel'] = isset( $texte[ $lang ] ) ? $texte[ $lang ] : $texte['en'];
	return $block;
} );
