### [CORS Lite](https://github.com/warren-bank/crx-cors-lite)

#### Summary:

A very minimal Chromium extension:
* allows the user to configure the regex patterns:
  * _URLs_
    * will add permissive CORS response headers to all matching URLs
    * will remove all response headers that match the _headers_ regex pattern
  * _headers_

#### Default Configuration:

* _URLs_ regex pattern will match:
  * file extensions for many common formats of video and external subtitles
  * PBS redirected video streams
* _headers_ regex pattern will match:
  * Access-Control-Max-Age
  * Access-Control-Allow-Methods
  * Access-Control-Allow-Headers
  * Content-Security-Policy

#### Credits:

* [icons](https://veryicon.com/icons/food--drinks/beer/coors-beer-glass.html) by _Michael Thomas_ under a _Creative Commons license_

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
