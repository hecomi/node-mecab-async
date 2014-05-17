var MeCab = new require('./mecab.js');
var testWord = 'すもももももももものうち';

// 非同期版
MeCab.parse(testWord, function(err, result) {
	if (err) throw err;
	console.log('非同期:\n', result);
});

// 非同期版
MeCab.wakachi(testWord, function(err, result) {
	if (err) throw err;
	console.log('非同期（わかち書き）:\n', result);
});

// 非同期版
MeCab.parseFormat(testWord, function(err, result) {
	if (err) throw err;
	console.log('非同期（フォーマット整形）:\n', result);
});

// 同期版
console.log('同期:\n', MeCab.parseSync(testWord) );

// 同期版
console.log('同期（わかち書き）:\n', MeCab.wakachiSync(testWord) );

// 同期版
console.log('同期（フォーマット整形）:\n', MeCab.parseSyncFormat(testWord) );

