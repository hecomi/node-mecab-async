var MeCab = new require('MeCab')
  , mecab = new MeCab()
;

mecab.parse('すもももももももものうち', function(err, result) {
	if (err) throw err;
	console.log(result);
});
