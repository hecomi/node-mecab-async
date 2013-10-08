var exec     = require('child_process').exec;
var execSync = require('execsync');

// for backward compatibility
var MeCab = function() {};

MeCab.prototype = {
	_format: function(arrayResult) {
		var result = [];
		// Reference: http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html
		// 表層形\t品詞,品詞細分類1,品詞細分類2,品詞細分類3,活用形,活用型,原形,読み,発音
		arrayResult.forEach(function(parsed) {
			if (parsed.length <= 8) { return; }
			result.push({
				kanji         : parsed[0],
				lexical       : parsed[1],
				compound      : parsed[2],
				compound2     : parsed[3],
				compound3     : parsed[4],
				conjugation   : parsed[5],
				inflection    : parsed[6],
				original      : parsed[7],
				reading       : parsed[8],
				pronunciation : parsed[9] || ''
			});
		});
		return result;
	},
	_parseMeCabResult : function(result) {
		var ret = [];
		result.split('\n').forEach(function(line) {
			ret.push(line.replace('\t', ',').split(','));
		});
		return ret;
	},
	parse : function(str, callback) {
		exec('echo "' + str + '" | mecab', function(err, result) {
			if (err) {
				callback(err, null);
				return;
			}
			callback(null, MeCab._parseMeCabResult(result).slice(0,-2));
		});
	},
	parseSync : function(str) {
		execSync(''); // for bug
		var result = execSync('echo ' + str + ' | mecab');
		return MeCab._parseMeCabResult(result).slice(0, -2);
	},
	parseFormat : function(str, callback) {
		MeCab.parse(str, function(err, result) {
			callback(err, MeCab._format(result));
		});
	},
	parseSyncFormat : function(str) {
		return MeCab._format(MeCab.parseSync(str));
	},
	_wakatsu : function(arr) {
		var ret = [];
		for (var i in arr) {
			ret.push(arr[i][0]);
		}
		return ret;
	},
	wakachi : function(str, callback) {
		MeCab.parse(str, function(err, arr) {
			if (err) {
				callback(err, null);
				return;
			}
			callback(null, MeCab._wakatsu(arr));
		});
	},
	wakachiSync : function(str) {
		var arr = MeCab.parseSync(str);
		console.log(arr);
		return MeCab._wakatsu(arr);
	}
};

for (var x in MeCab.prototype) {
	MeCab[x] = MeCab.prototype[x];
}

module.exports = MeCab;
