/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/6/22.
 */

'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var JSZip = require("jszip");
var router = express.Router();

var ebayCtrl = require('../controller/ebay.ctrl');
var jdCtrl = require('../controller/jd.ctrl');

var rootDir = path.join(__dirname, '../');
var goodsPlatformList = [
	'ebay',
	'jd'
];

router.get('/', function (req, res) {
	res.render('index', {
		title: '助手',
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
				console.log(item);
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

module.exports = router;
