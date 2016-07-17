function getCurrentTabUrl(callback){
	// Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
})};

function getContentSummary(pageUrl, callback, errorCallback){
	var init_url = "http://api.smmry.com/&SM_API_KEY=8C1255AD07&SM_LENGTH=5&SM_URL="+pageUrl;

    var x = new XMLHttpRequest();
    x.open('GET', init_url, true);
    // The Google image search API responds with JSON, so let Chrome parse it.
    x.responseType = 'json';
    x.onload = function() {
        console.log('inside onload');
        // Parse and process the response from Google Image Search.
        var response = x.response;
        console.log(response);
        if (!response['sm_api_content']) {
            errorCallback('No response from Smmry!');
            return;
        }
        var summary_content = response['sm_api_content'];

        console.log(summary_content);
        callback(summary_content);
    };
    x.onerror = function() {
        errorCallback('Network error.');
    };
    x.send();
}

function renderStatus(statusText){
	document.getElementById('status').textContent = statusText;
}
document.addEventListener('DOMContentLoaded',function() {
    getCurrentTabUrl(function (url) {

        renderStatus('Generating summary for for ' + url);

        getContentSummary(url, function (summary) {

            renderStatus(summary);


        }, function (errorMessage) {
            renderStatus('Cannot display summary. ' + errorMessage);
        });
    })
});


