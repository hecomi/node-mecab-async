var exec     = require('child_process').exec;
var execSync = require('execsync');

// for backward compatibility
var MeCab = function() {};

MeCab.prototype = {
	_parseMeCabResult : function(result) {
		var ret = [];
		result.split('\n').forEach(function(line) {
			ret.push(line.replace('\t', ',').split(','));
		});
		return ret;
	},
	parse : function(str, callback) {
		exec('echo ' + str + ' | mecab', function(err, result) {
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
		return MeCab._parseMeCabResult(result).slice(0,-2);
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
