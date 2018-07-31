var url_regex_pattern

var update_url_regex_pattern = function(str) {
  var backup = url_regex_pattern
  try {
    url_regex_pattern = new RegExp(str, 'i')
    return true
  }
  catch(e) {
    url_regex_pattern = backup
    return false
  }
}

var reload = function() {
  chrome.storage.sync.get("url_regex_pattern", function(items) {
    update_url_regex_pattern(items.url_regex_pattern)
  })
}

var responseListener = function(details) {
  if (details && details.url && url_regex_pattern && url_regex_pattern.test(details.url)) {
    var flag = false
    var rule = {
      "name": "access-control-allow-origin",
      "value": "*"
    }

    for (var i = 0; i < details.responseHeaders.length; i++) {
      if (details.responseHeaders[i].name.toLowerCase() === rule.name) {
        flag = true
        details.responseHeaders[i].value = rule.value
        break
      }
    }

    if (!flag) details.responseHeaders.push(rule)
  }
}

chrome.webRequest.onHeadersReceived.addListener(
  responseListener,
  {
    urls:["<all_urls>"]
  },
  ["blocking", "responseHeaders"]
)

chrome.runtime.onInstalled.addListener(
  function(details){
    if (details.reason === "install"){
      // initialize default value of option(s)
      chrome.storage.sync.set({
        "url_regex_pattern": "\\.(?:mp4|mp4v|mpv|m1v|m4v|mpg|mpg2|mpeg|xvid|webm|3gp|avi|mov|mkv|ogv|ogm|m3u8|mpd|ism(?:[vc]|/manifest)?|vtt|srt|sami|dfxp)(?:[\\?#].*)?$"
      }, reload)
    }
  }
)

reload()
