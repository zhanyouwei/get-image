/**
 * Created by Mr.zhan on 14-10-16.
 * E-mail:zhanyouwei@icloud.com
 */
$(function () {
	var imgSrcList = [];
	var getImageElem = $('#getImage');
	var downloadElem = $('#download');


	getImageElem.on('click', function () {
		console.log('click');

		chrome.tabs.getSelected(function (tab) {
			chrome.tabs.executeScript(tab.id, {
				code: "var getImagePlatForm='tmall';",
				allFrames: true
			});
			chrome.tabs.executeScript(tab.id, {
				file: "js/jquery.min.js",
				allFrames: true
			});
			chrome.tabs.executeScript(tab.id, {
				file: "js/getimage.js",
				allFrames: true
			});
		});
	});

	downloadElem.on('click', function (e) {
		chrome.downloads.download({url:'http://localhost:9000/zip/images.zip'}, function (res) {

		});
	});

	chrome.extension.onMessage.addListener(function (msg) {
		console.log(msg);
		if (msg.values.length) {
			imgSrcList = msg.values;
			$('#test').html(msg.values.length);
			$.ajax({
				type: "post",
				url: 'http://localhost:9000/download',
				data: {srcList: imgSrcList},
				success: function (data) {
					console.log(data);
				}
			});
		}
	});
});
