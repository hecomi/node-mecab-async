var MeCab = new require('./mecab.js');
var testWord = '動作テスト';

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
