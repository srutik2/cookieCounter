// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const promises = tabs.map((tab) => {
//     return new Promise((resolve) => {
//       const url = new URL(tab.url);
//       const hostname = url.hostname;
//       const protocol = url.protocol;

//       console.log(`Getting cookies for: ${protocol}//${hostname}`);

//       chrome.cookies.getAll({ url: `${protocol}//${hostname}` }, (cookies) => {
//         resolve(cookies.length);
//       });
//     });
//   });

//   Promise.all(promises).then((cookieCounts) => {
//     const totalCookieCount = cookieCounts.reduce((acc, count) => acc + count, 0);

//     const sessionCookieCount = document.getElementById("session-cookie-count");
//     if (sessionCookieCount) {
//       sessionCookieCount.textContent = totalCookieCount.toString();
//     }

//     const cookieCountElements = document.querySelectorAll("#cookie-count");
//     let i = 0;
//     for (const count of cookieCounts) {
//       const cookieCountElement = cookieCountElements[i];
//       if (cookieCountElement) {
//         cookieCountElement.textContent = count.toString();
//       }
//       i++;
//     }
//   });
// });

// function readLocal = async (key) => {
//   return new Promise((resolve,reject) => {
//     chrome.storage.local.get([key], function(result) {
// 	  resolve(result[key]);
// 	}
//   }
// }

// function readLocal(key) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.session.get([key]).then((result) => resolve(result[key]));
//   });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   chrome.storage.session.get(["addedCookies", "removedCookies"], function (result) {
//     let cookieCount = document.getElementById("active-cookie-count");
//     let addedCookies = result["addedCookies"] || 0;
//     let removedCookies = result["removedCookies"] || 0;
//     cookieCount.textContent = addedCookies - removedCookies;

//     let sessionCookieCount = document.getElementById("total-cookie-count");
//     sessionCookieCount.textContent = addedCookies;
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   chrome.storage.session.get(["addedCookies", "thirdPartyCookies"], function (result) {

//     let totalCookieCount = document.getElementById("total-cookie-count");
//     let addedCookies = result["addedCookies"] || 0;

//     let thirdPartyCookieCount = document.getElementById("third-party-cookie-count");
//     let thirdPartyCookies = result["thirdPartyCookies"] || 0;

//     totalCookieCount.textContent = addedCookies;
//     thirdPartyCookieCount.textContent = thirdPartyCookies;

//     chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//       let currentTab = tabs[0];
//       let currentUrl = new URL(currentTab.url);
//       let currentHostname = currentUrl.hostname;
//       let currentProtocol = currentUrl.protocol;

//       console.log("Getting cookies for: " + currentProtocol + "//" + currentHostname);

//       chrome.cookies.getAll({ url: currentProtocol + "//" + currentHostname }, (cookies) => {
//         let websiteCookieCount = document.getElementById("website-cookie-count");
//         websiteCookieCount.textContent = cookies.length.toString();

//         let firstPartyCookieCount = document.getElementById("first-party-cookie-count");
//         // find the number of firstPartyCookies by properly slicing the domain and hostname
//         let firstPartyCookies = cookies.filter((cookie) => {

//           let cookieDomain = cookie.domain.split('.').slice(-2).join('.');
//           let cookieHostname = currentHostname.split('.').slice(-2).join('.');
//           return cookieDomain == cookieHostname;
//         }
//         ).length;
//         firstPartyCookieCount.textContent = firstPartyCookies.toString();
//       });
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', function () {
  // return count of chrome.cookies.getAll()
  chrome.cookies.getAll({ }, (cookies) => { 
    let totalCookies = cookies.length;

    let totalCookieCount = document.getElementById("total-cookie-count");
    totalCookieCount.textContent = totalCookies.toString();
  });


  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let currentTab = tabs[0];
    let currentUrl = new URL(currentTab.url);
    let currentHostname = currentUrl.hostname;
    let currentProtocol = currentUrl.protocol;

    chrome.cookies.getAll({ url: currentProtocol + "//" + currentHostname }, (cookies) => {
      let domainCookieCount = document.getElementById("domain-cookie-count");
      domainCookieCount.textContent = cookies.length.toString();
    });

    chrome.cookies.getAll({ url: currentProtocol + "//" + currentHostname}, (cookies) => {
      let strictCookieCount = document.getElementById("strict-cookie-from-domain");
      // find count of cookies where sameSite is 'strict'

      strictCookieCount.textContent = cookies.filter((cookie) => cookie.sameSite == 'strict').length.toString();
    });

  });

  chrome.storage.session.get(["newCookies"], function (result) {
    let newCookies = document.getElementById("new-cookies-in-session");
    let thirdPartyCookies = result["newCookies"] || 0;

    newCookies.textContent = thirdPartyCookies;
  });
});
