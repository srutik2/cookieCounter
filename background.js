

// helper function to increment a storage.local variable with a given key
function incrementStorage(key) {
  chrome.storage.session.get([key], function (result) {
    let count = result[key] || 0;
    chrome.storage.session.set({ [key]: count + 1 });
    console.log('Incremented ' + key + ' to ' + (count + 1));
  });
}

chrome.cookies.onChanged.addListener(function (changeInfo) {
  if (changeInfo.cause.slice(-9) !== 'overwrite' && !changeInfo.removed) {
    incrementStorage('addedCookies');
    console.log("hehehhee");
    console.log(changeInfo);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let currentHostname = new URL(tabs[0].url).hostname;
      let host = currentHostname.split('.').slice(-2).join('.');
      let dom = changeInfo.cookie.domain.split('.').slice(-2).join('.');

      if (host != dom) {
        incrementStorage('thirdPartyCookies');
      }

    });
  }
});
