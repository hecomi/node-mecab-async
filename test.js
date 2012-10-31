var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;

// 非同期版
mecab.parse('すもももももももものうち', function(err, result) {
	if (err) throw err;
	console.log('非同期:')
	console.log(result);
});

// 非同期版
mecab.wakachi('すもももももももものうち', function(err, result) {
	if (err) throw err;
	console.log('非同期:')
	console.log(result);
});

// 同期版
console.log('同期:')
console.log( mecab.parseSync('すもももももももものうち') );

// 同期版
console.log('同期:')
console.log( mecab.wakachiSync('すもももももももものうち') );
