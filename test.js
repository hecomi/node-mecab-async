var MeCab = new require('./mecab.js');
var testWord = 'すもももももももものうち';

// 非同期版
MeCab.parse(testWord, function(err, result) {
	if (err) throw err;
	console.log('非同期:');
	console.log(result);
});

// 非同期版
MeCab.wakachi(testWord, function(err, result) {
	if (err) throw err;
	console.log('非同期:');
	console.log(result);
});

// 非同期版
MeCab.parseFormat(testWord, function(err, result) {
	if (err) throw err;
	console.log('非同期:');
	console.log(result);
});

// 同期版
console.log('同期:');
console.log( MeCab.parseSync(testWord) );

// 同期版
console.log('同期:');
console.log( MeCab.wakachiSync(testWord) );

// 同期版
console.log('同期（フォーマット整形）:');
console.log( MeCab.parseSyncFormat(testWord) );

