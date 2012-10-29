{
	'targets': [{
		'target_name' : 'mecab',
		'sources'     : [ 'mecab.cc' ],
		'cflags'      : [ '-std=c++0x' ],
		'libraries'   : [ '-lmecab' ],
		'conditions'  : [
			['OS=="mac"', {
				'include_dirs' : [
					'/usr/local/include/libcxx',
				],
				'xcode_settings' : {
					'OTHER_CFLAGS': [
						'-std=c++0x',
					],
				},
			},],
		],
	},],
}
