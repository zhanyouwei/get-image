/**
 * Created by Mr.zhan on 14-10-16.
 * E-mail:zhanyouwei@icloud.com
 */
$(function () {
	var imgSrcList = [];
	var platformHttpType = null;
	var getImageElem = $('#getImage');
	var downloadElem = $('#download');
	var loadingElem = $('#loading');
	var tipsElem = $('#tips');


	getImageElem.on('click', function () {

		chrome.tabs.getSelected(function (tab) {
			if (tab.url.indexOf('https') === -1) {
				platformHttpType = 'http';
			} else {
				platformHttpType = 'https';
			}

			var platFormInfo = getPlatForm(tldjs.getDomain(tab.url));

			chrome.tabs.executeScript(tab.id, {
				code: "var getImagePlatFormName='" + platFormInfo.platFormName + "';",
				allFrames: true
			});
			chrome.tabs.executeScript(tab.id, {
				code: "var getImagePlatFormHttpType='" + platFormInfo.platFormHttpType + "';",
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
	});

	chrome.extension.onMessage.addListener(function (msg) {
		loadingElem.removeClass('am-hide');
		if (msg.values.length) {
			imgSrcList = msg.values;
			tipsElem.html('共:' + msg.values.length + '张图片,正在分析中。。。');
			$.ajax({
				type: "post",
				url: 'http://192.168.10.54:9400/download',
				data: {
					srcList: imgSrcList,
					goodsName: msg.goodsName,
					httpType: platformHttpType
				},
				success: function (data) {
					getImageElem.addClass('am-btn-success');
					getImageElem.text('分析完成, 已下载');
					tipsElem.text('');
					chrome.downloads.download({url: 'http://192.168.10.54:9400/zip/' + msg.goodsName + '.zip'});
				}
			});
		}
	});

	function getPlatForm(domain) {
		var platformName = null;
		switch (domain) {
			case 'tmall.com':
				platformName = 'tmall';
				break;
			case 'tmall.hk':
				platformName = 'tmallhk';
				break;
			case 'taobao.com':
				platformName = 'taobao';
				break;
			case 'jd.com':
				platformName = 'jd';
				break;
			case 'amazon.com':
				platformName = 'amazon';
				break;
			case 'ebay.com':
				platformName = 'ebay';
				break;
			case 'jomashop.com':
				platformName = 'jomashop';
				break;
			case 'kaola.com':
				platformName = 'kaola';
				break;
			case 'ymatou.com':
				platformName = 'ymatou';
				break;
		}
		return {
			platFormName: platformName,
			platFormHttpType: platformHttpType
		}
	}
});
