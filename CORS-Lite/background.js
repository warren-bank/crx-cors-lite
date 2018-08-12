var regex_patterns = {
  url:     null,
  headers: null
}

var update_regex_pattern = function(key, str) {
  var backup

  if (!str) {
    regex_patterns[key] = null
    return true
  }
  else {
    backup = regex_patterns[key]
    try {
      regex_patterns[key] = new RegExp(str, 'i')
      return true
    }
    catch(e) {
      regex_patterns[key] = backup
      return false
    }
  }
}

var reload = function() {
  chrome.storage.sync.get(["url_regex_pattern", "headers_regex_pattern"], function(items) {
    var key, val
    for (key in items) {
      val = items[key]
      key = key.replace('_regex_pattern', '')
      update_regex_pattern(key, val)
    }
  })
}

var update_headers = function(headers, updated_header, first_pass) {
  var is_updated = false

  updated_header.name = updated_header.name.toLowerCase()

  for (var i=(headers.length - 1); i>=0; i--) {
    if (first_pass) {
      headers[i].name = headers[i].name.toLowerCase()

      if (regex_patterns.headers && regex_patterns.headers.test(headers[i].name)) {
        headers.splice(i, 1)
        continue
      }
    }
    if (headers[i].name === updated_header.name) {
      is_updated = true
      headers[i].value = updated_header.value
    }
  }

  if (!is_updated) {
    headers.push(updated_header)
  }
}

var responseListener = function(details) {
  var headers = (details.responseHeaders && details.responseHeaders.length) ? [...details.responseHeaders] : []

  if (details && details.url && regex_patterns.url && regex_patterns.url.test(details.url)) {
    var updated_headers = [{
      "name": "Access-Control-Allow-Origin",
      "value": "*"
    },{
      "name": "Access-Control-Allow-Headers",
      "value": "*"
    },{
      "name": "Access-Control-Allow-Methods",
      "value": "*"
    }]

    updated_headers.forEach(function(updated_header, index){
      update_headers(headers, updated_header, (index===0))
    })
  }

  return {responseHeaders: headers}
}

chrome.webRequest.onHeadersReceived.addListener(
  responseListener,
  {
    urls:  ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"]
  },
  ["blocking", "responseHeaders"]
)

chrome.runtime.onInstalled.addListener(
  function(details){
    if (details.reason === "install"){
      // initialize default value of option(s)
      var url_regexs, headers_regexs

      url_regexs = []
      url_regexs.push("\\.(?:mp4|mp4v|mpv|m1v|m4v|mpg|mpg2|mpeg|xvid|webm|3gp|avi|mov|mkv|ogv|ogm|m3u8|mpd|ism(?:[vc]|/manifest)?|vtt|srt|sami|dfxp)(?:[\\?#].*)?$")
      url_regexs.push("pbs\\.org/redirect/")
      url_regexs = "(?:" + url_regexs.join("|") + ")"

      headers_regexs = []
      headers_regexs.push("Access-Control-Max-Age")
      headers_regexs.push("Access-Control-Allow-Methods")
      headers_regexs.push("Access-Control-Allow-Headers")
      headers_regexs.push("Content-Security-Policy")
      headers_regexs = "(?:" + headers_regexs.join("|").toLowerCase() + ")"

      chrome.storage.sync.set({
        "url_regex_pattern":     url_regexs,
        "headers_regex_pattern": headers_regexs
      }, reload)
    }
  }
)

reload()
