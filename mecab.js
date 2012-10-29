var fs   = require('fs')
  , path = require('path')
  , MeCab
;

if ( fs.existsSync( path.join(__dirname, './build/Debug') ) ) {
	MeCab = require('./build/Debug/mecab').MeCab;
} else if ( fs.existsSync( path.join(__dirname, './build/Release') ) ) {
	MeCab = require('./build/Release/mecab').MeCab;
} else {
	throw '"mecab-async" has not been compiled yet.'
}

MeCab.prototype.wakachi = function(str, callback) {
	this.parse(str, function(err, result) {
		if (err) callback(err, null);
		var ret = [];
		for (var i in result) {
			ret.push(result[i][0]);
		}
		callback(null, ret);
	});
};

module.exports = MeCab;
