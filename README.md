# はじめに
このプラグインはRPGツクールMVでの開発において、表示するメッセージの内容をExcelやGoogle SpreadSheetで管理するためのものです。  
現状「文章の表示」にのみ対応していますが、基本的には必要な（メッセージが表示される）箇所をフックし文字列をGameStrings.Formatを通す事で変換することが可能です。  

主な使い道としては多言語対応が考えられます。  
エディター上での文章を予め`MESSAGE001`などにして、データ上で日本語と英語を作っておくことで簡単に言語を切り替えられるようになります。

# 対応バージョン
下記のコアスクリプトのバージョンで動作を確認しています。
* RPGツクールMV ver1.5.0 

# 使い方

1. あらかじめGoogle SpreadSheet等にまとめたデータベースを元に何らかの方法でjson形式で出力
1. 出力したjsonをdataフォルダ以下に`GameStrings.json`として保存
1. プラグインを追加