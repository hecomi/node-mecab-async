var MeCab = new require('./mecab.js');

// 非同期版
MeCab.parse('すもももももももものうち', function(err, result) {
	if (err) throw err;
	console.log('非同期:')
	console.log(result);
});

// 非同期版
MeCab.wakachi('すもももももももものうち', function(err, result) {
	if (err) throw err;
	console.log('非同期:')
	console.log(result);
});

// 同期版
console.log('同期:')
console.log( MeCab.parseSync('すもももももももものうち') );

// 同期版
console.log('同期:')
console.log( MeCab.wakachiSync('すもももももももものうち') );
