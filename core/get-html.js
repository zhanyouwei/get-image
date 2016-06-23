/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/6/23.
 */

var phantom = require('phantom');
var cheerio = require('cheerio');

var sitepage = null;
var phInstance = null;
var htmlContent = null;

function getHtml(url,cb) {
	phantom.create()
		.then(function (instance) {
			phInstance = instance;
			return instance.createPage();
		})
		.then(function (page) {
			sitepage = page;
			page.setting('javascriptEnabled');
			return page.open(url);
		})
		.then(function (status) {
			console.log(status);
			return sitepage.property('content');
		})
		.then(function (content) {
			//console.log(content);
			sitepage.close();
			phInstance.exit();
			cb(content);
		})
		.catch(function (error) {
			console.log(error);
			phInstance.exit();
		});
}

exports.getHtml = getHtml;