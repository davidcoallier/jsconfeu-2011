<?php
/**
 * This is an overly complicated file that is used during a demo
 * at @JSConfEu2011. The point is to show all the JavaScript guys
 * that we too have lambdas and closures ;-)
 *
 * The real point of the script is to mimick something complex being
 * executed by a PHP script that would be running business logic.
 *
 * @author    David Coallier <david@orchestra.io>
 * @copyright David Coallier
 * @license   New BSD
 */
if (!isset($_GET['word'])) {
    echo json_encode(array("error" => "fail"));
    exit;
}

require_once __DIR__ . '/jsconf/Apc.php';

// Namespaces bitches!
use jsconf\Apc as Apc;

$apc           = new Apc();

// Now... Imagine this is absolutely crazy business logic however, for
// the purpose of this experiment and being at JSConf, let's talk like a pirate.
$translatorUrl = 'http://postlikeapirate.com/AJAXtranslate.php?typing=%s';
$word          = htmlspecialchars($_GET['word']);

// That's right... we have lambdas too.
$res = function($word) use ($translatorUrl, $apc) {

    $cachedValue = $apc->get($word);

    // Let's retrieve teh cached value if it exists.
    if ($cachedValue !== null && $cachedValue !== false) {
        return json_encode(array(
            'success' => $cachedValue
        ));
    }

    $result = file_get_contents(
        sprintf($translatorUrl, urlencode($word))
    );

    // Let's not fetch the same thing over and over again please.
    $apc->set($word, $result);

    return json_encode(array(
        'success' => $result
    ));
};

// This lambda is completely useless but I wanted to show
// you that we do have lambdas. Oh well.
echo $res($word);
