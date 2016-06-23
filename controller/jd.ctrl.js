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


	var srcpreFix = 'http://img13.360buyimg.com/n1/';
	var infoImageSrcPrefix = 'http://img20.360buyimg.com/vc/jfs/';

	getHtml(url, function (content) {
		var $ = cheerio.load(content);
		var baseSrc = $('#spec-n1 img').attr('src');

		var srcArr = [];
		var nameArrTemp = [];
		var srcSplitArr = [];
		if ($('.spec-items img').length > 0) {
			$('.spec-items img').each(function (key, value) {
				srcSplitArr = value.attribs.src.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if (_.indexOf(nameArrTemp, itemName) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: srcpreFix + value.attribs.src.split('n5/')[1],
						imgName: itemName
					});
				}
			});
		} else {
			var srcSplitArr = baseSrc.split('/');
			var itemName = srcSplitArr[srcSplitArr.length - 1];

			if (_.indexOf(nameArrTemp, itemName) === -1) {
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
				formworkImgSrc = value.attribs['data-lazyload'];

				srcSplitArr = formworkImgSrc.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if (_.indexOf(nameArrTemp, itemName) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: infoImageSrcPrefix + formworkImgSrc.split('/jfs/')[1],
						imgName: itemName
					});
				}
			});
		}


		srcArr = _.uniq(srcArr);

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
}

exports.analysis = analysis;