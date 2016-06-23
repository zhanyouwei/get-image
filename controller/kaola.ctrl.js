/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/6/22.
 */


var http = require("http");
var fs = require("fs");
var path = require("path");
var superAgent = require('superagent');
var cheerio = require('cheerio');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var async = require('async');

var getHtml = require('../core/get-html').getHtml;


var rootDir = path.join(__dirname, '../');

function analysis(url, name, cb) {
	var downloadDir = rootDir + "/download/images/";

	mkdirp(downloadDir + name, function (err) {
		if (err) cb(err);
		else {
			downloadDir = rootDir + "/download/images/" + name + '/';
		}
	});

	getHtml(url, function (content) {
		//console.log(content);
		console.time('analysisHtml');
		var $ = cheerio.load(content);
		console.log($('#showImgBox img'));
		var baseSrc = $('#showImgBox img').attr('src');

		var srcArr = [];
		var nameArrTemp = [];
		var srcSplitArr = [];
		if ($('#litimgUl img').length > 0) {
			$('#litimgUl img').each(function (key, value) {
				srcSplitArr = value.attribs.src.split('?')[0].split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if (_.indexOf(nameArrTemp, itemName) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: value.attribs.src.replace('thumbnail=64x0', 'thumbnail=800x0'),
						imgName: itemName
					});
				}
			});
		} else {
			srcSplitArr = baseSrc.split('?')[0].split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if (_.indexOf(nameArrTemp, itemName) === -1) {
				nameArrTemp.push(itemName);
				srcArr.push({
					imgUrl: baseSrc.replace('thumbnail=64x0', 'thumbnail=800x0'),
					imgName: itemName
				});
			}
		}
		console.timeEnd('analysisHtml');
		console.log($('#js_iframe_desc')[0].attribs.src);
		console.log(url.split('.com/')[0] + '.com' + $('#js_iframe_desc')[0].attribs.src);
		var childHtmlUrl = url.split('.com/')[0] + '.com' + $('#js_iframe_desc')[0].attribs.src;
		getHtml(childHtmlUrl, function (childContent) {
			var $_child = cheerio.load(childContent);
			console.log($_child('#mainContent img').length);
			if ($_child('#mainContent img').length > 0) {
				var contentImgSrc;
				$_child('#mainContent img').each(function (key, value) {
					contentImgSrc = value.attribs['lazyload'];

					srcSplitArr = contentImgSrc.split('?')[0].split('/');
					var itemName = srcSplitArr[srcSplitArr.length - 1];

					if (_.indexOf(nameArrTemp, itemName) === -1) {
						nameArrTemp.push(itemName);
						srcArr.push({
							imgUrl: contentImgSrc,
							imgName: itemName
						});
					}
				});
			}


			srcArr = _.uniq(srcArr);
			console.log(srcArr);

			async.each(srcArr, function (item, callback) {
				http.get(item.imgUrl, function (res) {
					var imgData = "";
					res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

					res.on("data", function (chunk) {
						imgData += chunk;
					});

					res.on("end", function () {
						fs.writeFile(downloadDir + item.imgName, imgData, "binary", function (err) {
							if (err) {
								console.log("down fail");
								return;
							}
							console.log("down success");
							callback();
						});
					});
				});
			}, function (err) {
				// if any of the file processing produced an error, err would equal that error
				if (err) {
					cb(err);
				} else {
					cb();
				}
			});
		});

	});
}

exports.analysis = analysis;