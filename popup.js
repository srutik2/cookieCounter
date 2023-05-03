document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('info_icon').addEventListener('click', () => {
    infoBoxes = document.getElementsByClassName('info-box')
    for (let box of infoBoxes) {
      // box.style.display = 'block';
      box.classList.toggle('hidden');
    }
  });

  // return count of chrome.cookies.getAll()
  chrome.cookies.getAll({ }, (cookies) => { 
    let totalCookies = cookies.length;

    let totalCookieCount = document.getElementById("total_cookie_count");
    totalCookieCount.textContent = totalCookies.toString();
  });


  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let currentTab = tabs[0];
    let currentUrl = new URL(currentTab.url);
    let currentHostname = currentUrl.hostname;
    let currentProtocol = currentUrl.protocol;

    chrome.cookies.getAll({ url: currentProtocol + "//" + currentHostname }, (cookies) => {
      let domainCookieCount = document.getElementById("domain_cookie_count");
      domainCookieCount.textContent = cookies.length.toString();
    });

    chrome.cookies.getAll({ url: currentProtocol + "//" + currentHostname}, (cookies) => {
      let strictCookieCount = document.getElementById("strict_cookie_from_domain");
      // find count of cookies where sameSite is 'strict'
      strictCookieCount.textContent = cookies.filter((cookie) => cookie.sameSite == 'strict').length.toString();
    });

  });

  chrome.storage.session.get(["newCookies"], function (result) {
    let newCookies = document.getElementById("new_cookies_in_session");
    let thirdPartyCookies = result["newCookies"] || 0;

    newCookies.textContent = thirdPartyCookies;
  });
});
