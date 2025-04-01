<?php
$cookies = [
    "fmt01=1; Expires=01 Aug 25 08:00:00",
    "fmt02=1; Expires=01 Aug 25 08:00 GMT",
    "fmt03=1; Expires=Fri, 01 Aug 25 8:00:00",
    "fmt04=1; Expires=Fri, 01 Aug 25 8:00 GMT",
    "fmt05=1; Expires=Fri Aug 01 08:00 GMT 2025",
    "fmt06=1; Expires=Fri Aug 01 08:00 +0000 2025",
    "fmt07=1; Expires=1 Aug 2025 08:00-GMT (Friday)",
    "fmt08=1; Expires=01-Aug-2025 08:00:00.00",
    "fmt09=1; Expires=01-Aug-2025 08:00pm",
    "fmt10=1; Expires=01-Aug-2025 08:00am",
    "fmt11=1; Expires=01-Aug-2025 08:00 PM",
    "fmt12=1; Expires=Friday, August 01, 2025 8:00 PM",
    "fmt13=1; Expires=08/01/25 08:00:00 PM",
    "fmt14=1; Expires=30/08/25 08:00",
    "fmt15=1; Expires=25-30-08 19:32:48 GMT",
    "_IMF-fixdate=1; Expires=Fri, 06 Aug 2025 08:00:00 GMT",
    "_IMF-fixdate_JST=1; Expires=Fri, 06 Aug 2025 08:00:00 JST",
    "_RFC850=1; Expires=Friday, 06-Aug-25 08:00:00 GMT",
    "_ANSI-C=1; Expires=Fri Aug  6 08:00:00 2025"
];

foreach ($cookies as $cookie) {
    header("Set-Cookie: {$cookie}", false);
}

echo "test";
