/**
 * Created by Mr.zhan on 14-10-16.
 * E-mail:zhanyouwei@icloud.com
 */
$(function () {
	var srcSplitArr = [];
	var nameArrTemp = [];


	function tmall(cb) {
		var srcArr = [];
		$('#J_UlThumb img').each(function (key, value) {
			var srcTemp = $(value).attr('src');
			srcSplitArr = srcTemp.split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: srcTemp.indexOf('https:') === -1 ? 'https:' + srcTemp.split('.jpg_')[0] + '.jpg' : srcTemp,
					imgName: itemName
				});
			}
		});
		$('#description img').each(function (key, value) {
			var srcTemp = $(value).attr('src');
			srcSplitArr = srcTemp.split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: srcTemp.indexOf('https:') === -1 ? 'https:' + srcTemp : srcTemp,
					imgName: itemName
				});
			}
		});
		cb(srcArr);
	}

	switch (getImagePlatForm) {
		case 'tmall':
			tmall(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result});
			});
			break;
		default:
			break;
	}

});