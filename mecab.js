const exec     = require('child_process').exec;
const execSync = require('child_process').execSync;
const sq       = require('shell-quote');

// for backward compatibility
var MeCab = function() {};

MeCab.prototype = {
    command : 'mecab',
    options : {},
    _format : function(arrayResult) {
        const result = [];
        if (!arrayResult) { return result; }
        // Reference: http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html
        // 表層形\t品詞,品詞細分類1,品詞細分類2,品詞細分類3,活用形,活用型,原形,読み,発音
        arrayResult.forEach(parsed => {
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
    _shellCommand : function(str) {
        return sq.quote(['echo', str]) + ' | ' + this.command;
    },
    _parseMeCabResult : function(result) {
        return result.split('\n').map(line => {
            const arr = line.split('\t');
            // EOS
            if (arr.length === 1) {
                return [line];
            }
            return [arr[0]].concat(arr[1].split(','));
        });
    },
    parse : function(str, callback) {
        process.nextTick(() => { // for bug
            exec(MeCab._shellCommand(str), this.options, (err, result) => {
                if (err) { return callback(err); }
                callback(err, MeCab._parseMeCabResult(result).slice(0,-2));
            });
        });
    },
    parseSync : function(str) {
        const result = execSync(MeCab._shellCommand(str), this.options);
        return MeCab._parseMeCabResult(String(result)).slice(0, -2);
    },
    parseFormat : function(str, callback) {
        MeCab.parse(str, (err, result) => {
            if (err) { return callback(err); }
            callback(err, MeCab._format(result));
        });
    },
    parseSyncFormat : function(str) {
        return MeCab._format(MeCab.parseSync(str));
    },
    _wakatsu : function(arr) {
        return arr.map(data => data[0]);
    },
    wakachi : function(str, callback) {
        MeCab.parse(str, (err, arr) => {
            if (err) { return callback(err); }
            callback(null, MeCab._wakatsu(arr));
        });
    },
    wakachiSync : function(str) {
        const arr = MeCab.parseSync(str);
        return MeCab._wakatsu(arr);
    }
};

for (const x in MeCab.prototype) {
    MeCab[x] = MeCab.prototype[x];
}

module.exports = MeCab;
