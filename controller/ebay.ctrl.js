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


var rootDir = path.join(__dirname, '../');

function analysis(url, name, cb) {
	var downloadDir = rootDir + "/download/images/";

	mkdirp(downloadDir + name, function (err) {
		if (err) cb(err);
		else {
			downloadDir = rootDir + "/download/images/" + name + '/';
		}
	});
	var srcReg = /\bg\/-?~?\b.*\b-?~?\/s\b/gi;

	superAgent
		.get(url)
		.end(function (err, res) {
			var $ = cheerio.load(res.text);

			var baseSrc = $('#icImg').attr('src');
			console.log(baseSrc);
			var splitArr = baseSrc.split('/');
			var imgSuffix = splitArr[splitArr.length - 1];

			var srcArr = [];
			var nameArrTemp = [];
			if($('.tdThumb img').length>0) {
				$('.tdThumb img').get().forEach(function (item) {
					var itemName = item.attribs.src.match(srcReg)[0].split('/')[1] + '_' + imgSuffix;

					if (_.indexOf(nameArrTemp, itemName) === -1) {
						nameArrTemp.push(itemName);
						srcArr.push({
							imgUrl: baseSrc.replace(srcReg,
								item.attribs.src.match(srcReg)[0]),
							imgName: itemName
						});
					}
				});
			}else{
				var itemName = baseSrc.match(srcReg)[0].split('/')[1] + '_' + imgSuffix;
				if (_.indexOf(nameArrTemp, itemName) === -1) {
					nameArrTemp.push(itemName);
					srcArr.push({
						imgUrl: baseSrc.replace(srcReg,
							baseSrc.match(srcReg)[0]),
						imgName: itemName
					});
				}
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
								console.log(err);
								console.log("down fail");
								return;
							}
							console.log("down success");
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