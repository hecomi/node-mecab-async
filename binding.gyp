{
	'targets': [{
		'target_name' : 'mecab',
		'sources'     : [ 'mecab.cc' ],
		'cflags'      : [ '-std=c++0x' ],
		'libraries'   : [ '-lmecab' ],
		'conditions'  : [
			['OS=="mac"', {
				'xcode_settings' : {
					'OTHER_CFLAGS': [
						'-std=c++0x',
					],
				},
			},],
		],
	},],
}
