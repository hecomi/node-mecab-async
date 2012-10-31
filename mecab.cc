#include <string>
#include <vector>
#include <memory>
#include <boost/tokenizer.hpp>
#include <mecab.h>
#include <node.h>

using namespace std;
using namespace v8;
using namespace node;

class MeCab_parser;
static uv_mutex_t m;

// 非同期処理でやり取りするデータ
struct MeCab_baton
{
	string                 str;
	string                 err;
	vector<vector<string>> result;
	Persistent<Function>   callback;
	MeCab_parser*          _this;
};

// MeCab を用いて文字列を形態素解析する
class MeCab_parser : public ObjectWrap
{
public:
	// MeCab_parser クラスを v8 の世界へ
	static void Init(Handle<Object>& target)
	{
		Local<FunctionTemplate> clazz = FunctionTemplate::New(MeCab_parser::New);
		clazz->SetClassName( String::NewSymbol("MeCab") );
		clazz->InstanceTemplate()->SetInternalFieldCount(1);
		NODE_SET_PROTOTYPE_METHOD(clazz, "parse",     MeCab_parser::Parse);
		NODE_SET_PROTOTYPE_METHOD(clazz, "parseSync", MeCab_parser::ParseSync);
		target->Set( String::NewSymbol("MeCab"), clazz->GetFunction() );
	};

	// tagger を返す
	shared_ptr<MeCab::Tagger> getTagger()
	{
		return tagger_;
	}

private:
	// tagger の初期化
	MeCab_parser()
		: ObjectWrap(), tagger_( MeCab::createTagger("") ) {};

	~MeCab_parser() {};

	// JavaScript の世界で new したら呼ばれる
	static Handle<Value> New(const Arguments& args)
	{
		HandleScope scope;

		auto _this = new MeCab_parser();
		_this->Wrap( args.This() );

		return scope.Close( args.This() );
	};

	// JavaScript の世界で parse したら呼ばれる（非同期版）
	static Handle<Value> Parse(const Arguments& args)
	{
		HandleScope scope;

		// 引数が文字列かどうかチェック
		if (!args[0]->IsString()) {
			Local<String> msg = String::New("[MeCab] Error! The 1st argument of 'parse' must be String.");
			ThrowException(Exception::TypeError(msg));
			return scope.Close(Undefined());
		}
		String::Utf8Value str(args[0]);

		// 非同期処理に必要なデータの成形
		auto data      = new MeCab_baton;
		data->str      = *str;
		data->_this    = ObjectWrap::Unwrap<MeCab_parser>( args.This() );
		data->callback = Persistent<Function>::New( args[1].As<Function>() );
		auto req       = new uv_work_t;
		req->data      = data;

		// 非同期で形態素解析して結果を callback 経由で返す
		uv_queue_work(
			uv_default_loop(),
			req,
			[](uv_work_t* req) {
				uv_mutex_lock(&m);

				auto data  = static_cast<MeCab_baton*>( req->data );
				auto _this = data->_this;

				// tagger のチェック
				auto tagger = _this->getTagger();
				if (!tagger) {
					data->err = MeCab::getTaggerError();
					return;
				}

				// パース結果のチェック
				auto node = _this->getTagger()->parseToNode( data->str.c_str() );
				if (!node) {
					data->err = tagger->what();
					return;
				}

				// 解析結果を配列に格納
				for (node = node->next; node->next; node = node->next) {
					// 形態素の文字列をまず格納
					vector<string> node_result;
					node_result.push_back( string(node->surface, node->length) );

					// パース結果を ',' で分割
					string feature( node->feature );
					boost::char_separator<char> sep(",");
					boost::tokenizer<boost::char_separator<char>> tok(feature, sep);
					for (const auto& str : tok) {
						node_result.push_back(str);
					}

					data->result.push_back(node_result);
				}
				uv_mutex_unlock(&m);
			},
			[](uv_work_t* req) {
				auto data  = static_cast<MeCab_baton*>( req->data );
				unique_ptr<uv_work_t>   preq(req);
				unique_ptr<MeCab_baton> pdata(data);
				HandleScope scope;

				auto err      = pdata->err;
				auto callback = pdata->callback;

				// 解析結果がエラーの場合はエラーを返す
				if ( !err.empty() ) {
					Local<Value> argv[2] = { String::New( err.c_str() ), String::New("") };
					callback->Call(Context::GetCurrent()->Global(), 2, argv);
				}

				// エラーでない場合は結果を整形して JavaScript へコールバック経由で呼び出す
				auto result_vec = pdata->result;
				auto result_arr = Array::New( result_vec.size() );
				int i = 0;
				for (const auto& node_result_vec : result_vec) {
					int j = 0;
					auto node_result_arr = Array::New( node_result_vec.size() );
					for (const auto& str : node_result_vec) {
						node_result_arr->Set( Number::New( j++ ), String::New( str.c_str() ) );
					}
					result_arr->Set( Number::New( i++ ), node_result_arr );
				}

				Local<Value> argv[2] = { String::New(""), result_arr };
				callback->Call(Context::GetCurrent()->Global(), 2, argv);
			}
		);

		return scope.Close( Undefined() );
	};

	// JavaScript の世界で parse したら呼ばれる（同期版）
	static Handle<Value> ParseSync(const Arguments& args)
	{
		HandleScope scope;
		auto _this = ObjectWrap::Unwrap<MeCab_parser>( args.This() );

		// 引数が文字列かどうかチェック
		if (!args[0]->IsString()) {
			Local<String> msg = String::New("[MeCab] Error! The 1st argument of 'parseSync' must be String.");
			ThrowException(Exception::TypeError(msg));
			return scope.Close(Undefined());
		}
		String::Utf8Value str(args[0]);

		// tagger のチェック
		auto tagger = _this->getTagger();
		if (!tagger) {
			string err = MeCab::getTaggerError();
			Local<String> msg = String::New( ("[MeCab] Error!: " + err).c_str() );
			ThrowException( Exception::TypeError(msg) );
			return scope.Close( Undefined() );
		}

		// パース結果のチェック
		auto node = tagger->parseToNode(*str);
		if (!node) {
			string err = tagger->what();
			Local<String> msg = String::New( ("[MeCab] Error!: " + err).c_str() );
			ThrowException( Exception::TypeError(msg) );
			return scope.Close( Undefined() );
		}

		// 解析結果を配列に格納
		vector<vector<string>> result_vec;
		for (node = node->next; node->next; node = node->next) {
			// 形態素の文字列をまず格納
			vector<string> node_result_vec;
			node_result_vec.push_back( string(node->surface, node->length) );

			// パース結果を ',' で分割
			string feature( node->feature );
			boost::char_separator<char> sep(",");
			boost::tokenizer<boost::char_separator<char>> tok(feature, sep);
			for (const auto& str : tok) {
				node_result_vec.push_back(str);
			}

			result_vec.push_back(node_result_vec);
		}

		// 結果を v8::Array に整形
		auto result_arr = Array::New( result_vec.size() );
		int i = 0;
		for (const auto& node_result_vec : result_vec) {
			int j = 0;
			auto node_result_arr = Array::New( node_result_vec.size() );
			for (const auto& str : node_result_vec) {
				node_result_arr->Set( Number::New( j++ ), String::New( str.c_str() ) );
			}
			result_arr->Set( Number::New( i++ ), node_result_arr );
		}

		return scope.Close( result_arr );
	};

	// tagger
	shared_ptr<MeCab::Tagger> tagger_;
};

void init(Handle<Object> target) {
	assert( uv_mutex_init(&m) == 0 );
	MeCab_parser::Init(target);
}

NODE_MODULE(mecab, init)
