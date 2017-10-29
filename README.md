Asynchronous japanese morphological analyser using MeCab
=============

これは何？
--------------
非同期で MeCab で結果をパースする Node.js 用モジュールです。

インストール
--------------
	$ npm install mecab-async

使い方
--------------
以下のようにコールバック経由で解析結果を取得します。

```javascript
var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;
mecab.parse('いつもニコニコあなたの隣に這い寄る混沌ニャルラトホテプです！', function(err, result) {
    if (err) throw err;
    console.log(result);
});
```

結果：

	[ [ 'いつも', '副詞', '一般', '*', '*', '*', '*', 'いつも', 'イツモ', 'イツモ' ],
	  [ 'ニコニコ', '副詞', '助詞類接続', '*', '*', '*', '*', 'ニコニコ', 'ニコニコ', 'ニコニコ' ],
	  [ 'あなた', '名詞', '代名詞', '一般', '*', '*', '*', 'あなた', 'アナタ', 'アナタ' ],
	  [ 'の', '助詞', '連体化', '*', '*', '*', '*', 'の', 'ノ', 'ノ' ],
	  [ '隣', '名詞', '一般', '*', '*', '*', '*', '隣', 'トナリ', 'トナリ' ],
	  [ 'に', '助詞', '格助詞', '一般', '*', '*', '*', 'に', 'ニ', 'ニ' ],
	  [ '這い', '動詞', '自立', '*', '*', '五段・ワ行促音便', '連用形', '這う', 'ハイ', 'ハイ' ],
	  [ '寄る', '動詞', '自立', '*', '*', '五段・ラ行', '基本形', '寄る', 'ヨル', 'ヨル' ],
	  [ '混沌', '名詞', '一般', '*', '*', '*', '*', '混沌', 'コントン', 'コントン' ],
	  [ 'ニャルラトホテプ', '名詞', '一般', '*', '*', '*', '*', '*' ],
	  [ 'です', '助動詞', '*', '*', '*', '特殊・デス', '基本形', 'です', 'デス', 'デス' ],
	  [ '！', '記号', '一般', '*', '*', '*', '*', '！', '！', '！' ] ]

わかち書きもできます。

```javascript
var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;
mecab.wakachi('いつもニコニコあなたの隣に這い寄る混沌ニャルラトホテプです！', function(err, result) {
    if (err) throw err;
    console.log(result);
});
```

結果：

	[ 'いつも',
	  'ニコニコ',
	  'あなた',
	  'の',
	  '隣',
	  'に',
	  '這い',
	  '寄る',
	  '混沌',
	  'ニャルラトホテプ',
	  'です',
	  '！' ]

同期版として `parseSync` および `wakachiSync` を使用することもできます。

その他
--------------

### コマンドの変更
実行される `mecab` コマンドのパスを明示的に指定したかったり、より詳細なオプションを指定したかったりする場合、
シェルコマンドをカスタマイズして使うこともできます。

```javascript
var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;
mecab.command = '/usr/local/bin/mecab -E "<改行>\\n"';   // EOSを <改行> と表示
```

### オプション
`exec` コマンドの与えるオプションを以下のように指定できます。

```javascript
var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;
mecab.options = {
    maxBuffer: 300 * 1024,
    timeout: 1000
};
```

### パーサ
辞書によって結果が異なる場合は`parseFormat`および`parseSyncFormat`で使用されるパーサをカスタマイズできます。

```javascript
var MeCab = new require('mecab-async')
  , mecab = new MeCab()
;
mecab.parser = data => {
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
};
```

ライセンス
----------
The MIT License (MIT)

Copyright (c) 2017 hecomi

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
