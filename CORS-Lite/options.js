function show_status_message(msg) {
  var status = document.getElementById('status')
  status.textContent = msg
  setTimeout(function() {
    status.textContent = ''
  }, 2500)
}

// Saves options to chrome.storage
function save_options() {
  var error

  var process_input = function(bg) {
    // process string regular expressions
    ['url_regex_pattern', 'headers_regex_pattern'].forEach(function(id){
      if (error) return

      var val = document.getElementById(id).value
      var key = id.replace('_regex_pattern', '')

      if (! bg.update_regex_pattern(key, val)) {
        error = key.toUpperCase() + ' regex pattern is invalid.'
      }
    })
    if (error) return

    // process_dropdowns
    ['allow_origin_value'].forEach(function(id){
      if (error) return

      var val = document.getElementById(id).value
      var key = id

      if (! bg.update_dropdown(key, val)) {
        error = key.toUpperCase() + ' dropdown is invalid.'
      }
    })
    if (error) return
  }

  chrome.runtime.getBackgroundPage(function(bg){
    process_input(bg)

    if (error) {
      show_status_message(error)
    }
    else {
      chrome.storage.sync.set({
        "url_regex_pattern":     document.getElementById("url_regex_pattern").value,
        "headers_regex_pattern": document.getElementById("headers_regex_pattern").value,
        "allow_origin_value":    document.getElementById("allow_origin_value").value
      }, function() {
        show_status_message('Options saved.')
      })
    }
  })
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(['url_regex_pattern', 'headers_regex_pattern', 'allow_origin_value'], function(items) {
    for (var key in items){
      document.getElementById(key).value = items[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options)

document.getElementById('save').addEventListener('click', save_options)
