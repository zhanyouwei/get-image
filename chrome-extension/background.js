/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/6/28.
 */

chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(tab);
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});


chrome.runtime.onMessage.addListener(function (msg) {
  console.log(msg);
});

setTimeout(function () {
  console.log('ok');
}, 10000);
