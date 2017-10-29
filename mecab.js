const exec     = require('child_process').exec;
const execSync = require('child_process').execSync;
const sq       = require('shell-quote');

// for backward compatibility
var MeCab = function() {};

MeCab.prototype = {
    command : 'mecab',
    options : {},
    parser: data => (data.length <= 8) ? null : {
        // Ref: http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html
        // 表層形\t品詞,品詞細分類1,品詞細分類2,品詞細分類3,活用形,活用型,原形,読み,発音
        kanji         : data[0],
        lexical       : data[1],
        compound      : data[2],
        compound2     : data[3],
        compound3     : data[4],
        conjugation   : data[5],
        inflection    : data[6],
        original      : data[7],
        reading       : data[8],
        pronunciation : data[9] || ''
    },
    _format : function(arr) {
        const results = [];
        if (!arr) { return results; }
        arr.forEach(data => {
            var result = this.parser(data);
            if (result) { results.push(result); }
        });
        return results;
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
            exec(this._shellCommand(str), this.options, (err, result) => {
                if (err) { return callback(err); }
                callback(err, this._parseMeCabResult(result).slice(0, -2));
            });
        });
    },
    parseSync : function(str) {
        const result = execSync(this._shellCommand(str), this.options);
        return this._parseMeCabResult(String(result)).slice(0, -2);
    },
    parseFormat : function(str, callback) {
        this.parse(str, (err, result) => {
            if (err) { return callback(err); }
            callback(err, this._format(result));
        });
    },
    parseSyncFormat : function(str) {
        return this._format(this.parseSync(str));
    },
    _wakatsu : function(arr) {
        return arr.map(data => data[0]);
    },
    wakachi : function(str, callback) {
        this.parse(str, (err, arr) => {
            if (err) { return callback(err); }
            callback(null, this._wakatsu(arr));
        });
    },
    wakachiSync : function(str) {
        const arr = this.parseSync(str);
        return this._wakatsu(arr);
    }
};

for (const x in MeCab.prototype) {
    MeCab[x] = MeCab.prototype[x];
}

module.exports = MeCab;
