<?php
$url = "https://curl.se/ca/cacert.pem";
$ctx = stream_context_create(['ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false    ]]);
$cert = file_get_contents($url, false, $ctx);
if ($cert) {
    file_put_contents('cacert.pem', $cert);
    echo "Downloaded cacert.pem successfully.\n";
}
else {
    echo "Failed to download.\n";
}
