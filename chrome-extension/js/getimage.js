/**
 * Created by Mr.zhan on 14-10-16.
 * E-mail:zhanyouwei@icloud.com
 */
$(function () {
	var srcSplitArr = [];
	var nameArrTemp = [];
	var goodsName = null;
	var count = 0;


	function getImage_tmall(cb) {
		goodsName = $('.tb-detail-hd h1').text().trim();
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

		$('body').animate({scrollTop: $(document).height()}, 15000, 'linear', function () {
			console.log('ok');
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
		});
	}

	function getImage_amazon(cb) {
		goodsName = $('#productTitle').text().trim();

		var baseSrc = $('#imgTagWrapperId img').attr('src');

		var srcArr = [];
		var nameArrTemp = [];
		var srcSplitArr = [];
		if ($('#altImages img').length > 0) {
			$('#altImages img').each(function (key, value) {
				var srcTemp = $(value).attr('src');
				srcSplitArr = srcTemp.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: srcTemp.replace('_US40_', '_US800_'),
						imgName: itemName
					});
				}
			});
		} else {
			srcSplitArr = baseSrc.split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: baseSrc,
					imgName: itemName
				});
			}
		}
		cb(srcArr);
	}

	function getImage_ebay(cb) {
		goodsName = $('#itemTitle').text().trim();
		console.log(goodsName);
		var srcReg = /\bg\/-?~?\b.*\b-?~?\/s\b/gi;
		var baseSrc = $('#icImg').attr('src');
		var splitArr = baseSrc.split('/');
		var imgSuffix = splitArr[splitArr.length - 1];

		var srcArr = [];
		var nameArrTemp = [];
		if ($('.tdThumb img').length > 0) {
			$('.tdThumb img').each(function (key, value) {
				var srcTemp = $(value).attr('src');
				var itemName = srcTemp.match(srcReg)[0].split('/')[1] + '_' + imgSuffix;

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: baseSrc.replace(srcReg,
							srcTemp.match(srcReg)[0]),
						imgName: itemName
					});
				}
			});
		} else {
			var itemName = baseSrc.match(srcReg)[0].split('/')[1] + '_' + imgSuffix;
			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: baseSrc.replace(srcReg,
						baseSrc.match(srcReg)[0]),
					imgName: itemName
				});
			}
		}
		cb(srcArr);
	}

	function getImage_jd(cb) {
		goodsName = $('#name h1').text().trim();
		var srcpreFix = 'http://img13.360buyimg.com/n1/';
		var infoImageSrcPrefix = 'http://img20.360buyimg.com/vc/jfs/';
		var baseSrc = $('#spec-n1 img').attr('src');
		var srcArr = [];
		var nameArrTemp = [];
		var srcSplitArr = [];
		if ($('.spec-items img').length > 0) {
			$('.spec-items img').each(function (key, value) {
				var srcTemp = $(value).attr('src');
				srcSplitArr = srcTemp.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: srcpreFix + srcTemp.split('n5/')[1],
						imgName: itemName
					});
				}
			});
		} else {
			var srcSplitArr = baseSrc.split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: srcpreFix + baseSrc.split('n5/')[1],
					imgName: itemName
				});
			}
		}
		if ($('.formwork_img img').length > 0) {
			var formworkImgSrc;
			$('.formwork_img img').each(function (key, value) {
				if ($(value).attr('data-lazyload') == 'done') {
					formworkImgSrc = $(value).attr('src');
				} else {
					formworkImgSrc = $(value).attr('data-lazyload');
				}

				srcSplitArr = formworkImgSrc.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: infoImageSrcPrefix + formworkImgSrc.split('/jfs/')[1],
						imgName: itemName
					});
				}
			});
		}
		cb(srcArr);
	}

	function getImage_kaola(cb) {
		goodsName = $('.product-title').text().trim();
		var baseSrc = $('#showImgBox img').attr('src');

		var srcArr = [];
		var nameArrTemp = [];
		var srcSplitArr = [];
		if ($('#litimgUl img').length > 0) {
			$('#litimgUl img').each(function (key, value) {
				var srcTemp = $(value).attr('src');
				srcSplitArr = srcTemp.split('?')[0].split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: srcTemp.replace('thumbnail=64x0', 'thumbnail=800x0'),
						imgName: itemName
					});
				}
			});
		} else {
			srcSplitArr = baseSrc.split('?')[0].split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: baseSrc.replace('thumbnail=64x0', 'thumbnail=800x0'),
					imgName: itemName
				});
			}
		}
		console.log($('#mainContent img').length);
		if ($('#mainContent img').length > 0) {
			var contentImgSrc;
			$('#mainContent img').each(function (key, value) {
				contentImgSrc = $(value).attr('lazyload');

				srcSplitArr = contentImgSrc.split('?')[0].split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: contentImgSrc,
						imgName: itemName
					});
				}
			});
		}

		cb(srcArr);
	}

	function getImage_jomashop(cb) {
		goodsName = $('.product-name').text().trim();
		var baseSrc = $('#MagicZoomPlus img').attr('src');
		var srcArr = [];
		var nameArrTemp = [];
		var srcSplitArr = [];
		if ($('.MagicZoomThumbsContainer img').length > 0) {
			$('.MagicZoomThumbsContainer img').each(function (key, value) {
				var srcTemp = $(value).attr('src');
				srcSplitArr = srcTemp.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if ($.inArray(itemName, nameArrTemp) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: srcTemp.replace('/thumbnail/70x70/', '/image/490x490/'),
						imgName: itemName
					});
				}
			});
		} else {
			srcSplitArr = baseSrc.split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if ($.inArray(itemName, nameArrTemp) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: baseSrc,
					imgName: itemName
				});
			}
		}
		cb(srcArr);
	}

	switch (getImagePlatFormName) {
		case 'tmall':
			getImage_tmall(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'tmallhk':
			getImage_tmall(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'taobao':
			getImage_tmall(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'amazon':
			getImage_amazon(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'ebay':
			getImage_ebay(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'jd':
			getImage_jd(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'jomashop':
			getImage_jomashop(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		case 'kaola':
			getImage_kaola(function (result) {
				chrome.runtime.sendMessage({message: "getUrl", values: result, goodsName: goodsName});
			});
			break;
		default:
			break;
	}

});