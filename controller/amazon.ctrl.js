/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/6/22.
 */


var http = require("http");
var https = require("https");
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
		try {
			console.time('analysisHtml');
			var $ = cheerio.load(content);
			var baseSrc = $('#imgTagWrapperId img').attr('src');

			var srcArr = [];
			var nameArrTemp = [];
			var srcSplitArr = [];
			if ($('#altImages img').length > 0) {
				$('#altImages img').each(function (key, value) {
					srcSplitArr = value.attribs.src.split('/');
					var itemName = srcSplitArr[srcSplitArr.length - 1];

					if (_.indexOf(nameArrTemp, itemName) === -1) {
						nameArrTemp.push(itemName);
						srcArr.push({
							imgUrl: value.attribs.src.replace('_US40_', '_US800_'),
							imgName: itemName
						});
					}
				});
			} else {
				srcSplitArr = baseSrc.split('/');
				var itemName = srcSplitArr[srcSplitArr.length - 1];

				if (_.indexOf(nameArrTemp, itemName) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: baseSrc,
						imgName: itemName
					});
				}
			}


			srcArr = _.uniq(srcArr);
			console.log(srcArr);

			async.each(srcArr, function (item, callback) {
				https.get(item.imgUrl, function (res) {
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
		} catch (err) {
			cb(err)
		}
	});
}

exports.analysis = analysis;