function show_status_message(msg) {
  var status = document.getElementById('status')
  status.textContent = msg
  setTimeout(function() {
    status.textContent = ''
  }, 2500)
}

// Saves options to chrome.storage
function save_options() {
  var url_regex_pattern = document.getElementById('url_regex_pattern').value

  chrome.runtime.getBackgroundPage(function(bg){
    if (bg.update_url_regex_pattern(url_regex_pattern)) {
      chrome.storage.sync.set({
        "url_regex_pattern": url_regex_pattern
      }, function() {
        show_status_message('Options saved.')
      })
    }
    else {
      show_status_message('Invalid pattern.')
    }
  })
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(['url_regex_pattern'], function(items) {
    for (var key in items){
      document.getElementById(key).value = items[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options)

document.getElementById('save').addEventListener('click', save_options)
