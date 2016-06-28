/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/6/22.
 */

'use strict';

var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var JSZip = require("jszip");
var async = require("async");
var mkdirp = require('mkdirp');
var router = express.Router();

var ebayCtrl = require('../controller/ebay.ctrl');
var jdCtrl = require('../controller/jd.ctrl');
var kaolaCtrl = require('../controller/kaola.ctrl');
var amazonCtrl = require('../controller/amazon.ctrl');
var jomashopCtrl = require('../controller/jomashop.ctrl');
var tmallCtrl = require('../controller/tmall.ctrl');

var rootDir = path.join(__dirname, '../');
var goodsPlatformList = [
	'ebay',
	'jd',
	'kaola',
	'amazon',
	'jomashop',
	'tmall'
];

router.get('/', function (req, res) {
	res.render('index', {
		title: '海淘助手',
		goodsPlatform: goodsPlatformList
	});
});

router.post('/analysis', function (req, res, next) {
	var goodsPlatform = req.body.goodsPlatform;
	var goodsUrl = req.body.goodsUrl;
	var goodsName = req.body.goodsName;

	if (_.indexOf(goodsPlatformList, goodsPlatform) !== -1) {
		switch (goodsPlatform) {
			case 'ebay':
				ebayCtrl.analysis(goodsUrl, goodsName, function (err) {
					if (err) {
						next(err);
						return;
					}
					res.redirect('/download/' + goodsName);
				});
				break;
			case 'jd':
				jdCtrl.analysis(goodsUrl, goodsName, function (err) {
					if (err) {
						next(err);
						return;
					}
					res.redirect('/download/' + goodsName);
				});
				break;
			case 'kaola':
				console.time('analysis');
				kaolaCtrl.analysis(goodsUrl, goodsName, function (err) {
					if (err) {
						next(err);
						return;
					}
					console.timeEnd('analysis');
					res.redirect('/download/' + goodsName);
				});
				break;
			case 'amazon':
				console.time('analysis');
				amazonCtrl.analysis(goodsUrl, goodsName, function (err) {
					if (err) {
						next(err);
						return;
					}
					console.timeEnd('analysis');
					res.redirect('/download/' + goodsName);
				});
				break;
			case 'jomashop':
				console.time('analysis');
				jomashopCtrl.analysis(goodsUrl, goodsName, function (err) {
					if (err) {
						next(err);
						return;
					}
					console.timeEnd('analysis');
					res.redirect('/download/' + goodsName);
				});
				break;
			case 'tmall':
				console.time('analysis');
				tmallCtrl.analysis(goodsUrl, goodsName, function (err) {
					if (err) {
						next(err);
						return;
					}
					console.timeEnd('analysis');
					res.redirect('/download/' + goodsName);
				});
				break;
			default:
				next();
				break;
		}
	}
});

router.get('/download/:name', function (req, res) {
	var name = req.params.name;
	var zipDir = rootDir + "/download/images/" + name + '.zip';
	if (name) {
		var zip = new JSZip();
		var dirPath = rootDir + '/download/images/' + name;
		var result = [];
		fs.readdir(dirPath, function (err, files) {
			//err 为错误 , files 文件名列表包含文件夹与文件
			if (err) {
				console.log('error:\n' + err);
				return;
			}
			files.forEach(function (item) {
				zip.file(item, fs.readFileSync(rootDir + '/download/images/' + name + '/' + item));
			});
			zip
				.generateNodeStream({type: 'nodebuffer', streamFiles: true})
				.pipe(fs.createWriteStream(zipDir))
				.on('finish', function () {
					console.log("out.zip written.");
					res.download(zipDir)
				});
		});

	} else {
		res.redirect('/');
	}
});

router.post('/download', function (req, res, next) {
	var httpObj = null;
	var goodsName = req.body.goodsName;
	var httpType = req.body.httpType;
	if (httpType == 'https') {
		httpObj = https;
	} else {
		httpObj = http;
	}
	var downloadDir = rootDir + "/download/images/";

	mkdirp(downloadDir + goodsName, function (err) {
		if (err) next(err);
		else {
			downloadDir = rootDir + "/download/images/" + goodsName + '/';
		}
	});
	async.each(req.body.srcList, function (item, callback) {
		httpObj.get(item.imgUrl, function (res) {
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
			next(err);
		} else {
			var zipDir = rootDir + '/public/zip/' + goodsName + '.zip';
			var zip = new JSZip();
			var result = [];
			fs.readdir(downloadDir, function (err, files) {
				//err 为错误 , files 文件名列表包含文件夹与文件
				if (err) {
					console.log('error:\n' + err);
					return;
				}
				files.forEach(function (item) {
					zip.file(item, fs.readFileSync(downloadDir + item));
				});
				zip
					.generateNodeStream({type: 'nodebuffer', streamFiles: true})
					.pipe(fs.createWriteStream(zipDir))
					.on('finish', function () {
						console.log("out.zip written.");
						res.send();
					});
			});
		}
	});
});

module.exports = router;
