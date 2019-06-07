[![npm version](https://badge.fury.io/js/firestore-migration.svg)](https://badge.fury.io/js/firestore-migration)
[![CircleCI](https://circleci.com/gh/gaku3601/firestore-migration.svg?style=svg)](https://circleci.com/gh/gaku3601/firestore-migration)
# 🎉firestore-migration🎉
<p align="center">
  <img src="./logo.png">
</p>

# firestore-migrationとは
これはfirestoreのdatabaseをmigrationするためのcomman lineツールです。  

# 注意事項
現状、実装段階です。  
ご利用する際はツールの挙動等を理解した上でご利用いただけますと幸いです。

# 仕組み[バージョンの管理について]
このツールを利用すると、初回に「migrations」というcollectionがrootに作成されます。  
このcollectionでmigrationのバージョン管理を行っております。  
collection内のdocumentIDとmigrationファイル「version_file名.json」のversionを比較し、versionが存在しなかった場合、対象のmigrationファイルを実行するというロジックで制作しています。  

# 設定方法
## 環境変数
環境変数として以下を設定してください。  

```
$FS_KEY: gcpのサービスアカウントkey(json)をBase64でdecodeした文字列
```

### FS_KEYの作り方
[ここを](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=ja)参考に、IAM>サービスアカウントからkeyを発行します。jsonのkeyファイルをダウンロードしたら、以下コマンドでBase64デコードを行います。

```
cat [jsonkeyファイルパス] | base64 -w 0
```

出力された文字列をFS_KEY環境変数に設定すればOKです。

## インストール
npm or yarnで以下コマンドでinstallしてください。

```
npm install -g firestore-migration
or
yarn global add firestore-migration
```

# 使い方

```
fsmigrate -c [ファイル名]
```
このコマンドでmigrationを行うためのファイルを生成します。

```
fsmigrate -m [スクリプト格納フォルダパス]
```
migration -cで生成したファイルからmigrationを実施します。

# ファイルの記述方法
## Field Add
対象コレクションへのフィールドの追加を行う場合、以下のように記述します。  

```
{
   "method": "ADD",
   "collection": "tests", // collection nameを記載
   "params": [
      {"name": "propA", "value": "propB"}, // name: フィールド名、value:設定する値
      {"name": "propC", "value": "propD"}
   ]
}
```

## Field Delete
対象コレクションのフィールド削除を行う場合、以下のように記述します。

```
{
   "method": "DEL",
   "collection": "tests",
   "params": [
      {"name": "propA"},
      {"name": "propB"}
   ]
}
```

## Field Modify
コレクション内の対象フィールドの内容を変更する場合、以下のように記述します。

```
{
   "method": "MOD",
   "collection": "tests",
   "params": [
      {"name": "propA", "if":"{propA} === 2 && {propC} === 'val2'","value": 1} // *1
   ]
}
[補足]
*1 if内では'{field名}'で現在格納されているfield内容を取得し、条件式を記述できます。trueの場合、value値を適用します。
```

## Change Field Name
Field名の変更を実施する場合、以下のように記述します。

```
{
   "method": "CHANGE_FIELD_NAME",
   "collection": "user",
   "params": [
      {"name": "name", "to": "nickname"},
      {"name": "age", "to": "tosi"}
   ]
}
```