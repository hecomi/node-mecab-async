var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;

mecab.parse('すもももももももものうち', function(err, result) {
	if (err) throw err;
	console.log(result);
});
