# MemoTube

[![MemoTube](https://user-images.githubusercontent.com/28818747/98420702-13594700-20cb-11eb-9268-8c304fdb7cb2.png)](http://memotube.xyz/)

## 製品概要
### オンライン授業 x Tech
### 背景(製品開発のきっかけ、課題等）

* オンライン授業で**パソコンを見ながらノートをとるのは大変**
  * パソコンとノートを並べるには広いスペースが必要
  * 授業の進行スピードによっては動画を止めたり戻さなければならない
  * 授業の動画はどうしても長くなりがちで復習しにくい
* そこで動画に直接メモを書き込めるWEBアプリを開発しました！


### 製品説明（具体的な製品の説明）

MemoTubeは動画に直接メモを書き込めるWEBアプリです.<br/>
* メモを取りたい動画のURLを指定し，動画を見ながら同じ画面でメモをとれます．<br/>
* メモの編集・削除・タグなどの基本的な機能に加え,メモにリンクした時間へ動画をジャンプできます．<br/>

詳しい使用方法はこちら<br/>


[<img src="https://user-images.githubusercontent.com/73517450/98463317-b4481f00-21fd-11eb-85db-8efd3a096764.png" width="70%">](https://www.youtube.com/watch?v=5g_SkXsIZvQ&feature=youtu.be "MemoTube")


### 特長

#### 1. 直接メモを動画に書き込める

* パソコンで動画を見ながら同じ画面でメモをとることができます．
* メモ記入中に動画が止まり, 快適にメモが取れます．
* ログイン機能があるので過去のメモを保存して後で見返すことができます．


#### 2. 書いたメモを友だちと共有できる

* メモを共有することで動画の面白い部分や大切な箇所を友達に教えられます．

#### 3. メモが時間とリンクしている

* メモをとった動画内の時間にワンクリックで飛ぶことができる
  * 授業の復習にぴったり

#### 4. AIを使った機能を搭載

* メモページのタグを自動生成
* メモ内容から感情を読み取りメモのハイライト
  
その他にも，メモやタイトル・タグからメモをシームレスに検索できる機能もあります


### 使い方

#### Web アプリケーション

ブラウザから使えるので簡単に利用できます．<br/>
http://memotube.xyz/


1. 新規ユーザー登録します！
2. 好きな動画を選んで＋ボタンよりURLを入力してメモの開始
3. お好きにメモを取ることができます

<!-- 以下の画面がデスクトップ端末での遷移画面になります．<br/>
まずはじめにユーザー登録をします．その後，ヘッダーの＋ボタンを押すと動画URLと動画タイトルの入力欄が開くので入力すると，メモページにて動画メモを作成することができます．<br/>
メモページはタイトル，メモページにつけるタグ一覧とタグの作成欄，URLの動画，メモ作成欄と作成したメモリストから成ります．それぞれ直感的に操作できるようにデザインされているため誰でもすぐに利用できるでしょう．作成したメモは記述したときの動画の時間と共にメモリストに表示されます．メモリスト上で作成したメモの編集・削除が可能です．
メモに付随した時間をクリックすることで, 動画のその時間にジャンプできるため，動画の重要なところを後々振り返る際に便利です．タグは手動で作成するだけでなくメモ内容から自動的に作成することも出来ます. また, メモ内容をAIによって感情のハイライトをすることが出来ます.<br/>
ユーザページには作成したメモの一覧が動画ページごとに表示され，キーワード検索欄から作成したメモの検索も可能となっています．  -->


### 解決出来ること

オンデマンド授業を見ながらの勉強・要約・振り返り・他の人との問題共有が容易になります.


### 今後の展望

* 現在はインターネット上の動画しか再生できないため、ローカルの動画ファイルも再生できるようにする．
* 同時編集機能を実装し友達と同時に勉強ができるように

### 注力したこと（こだわり等）

* メモ作成の使い勝手・検索機能
* ログイン・メモの共有機能
* レスポンシブなユーザーインターフェース
* AIによるキーワードの自動抽出およびメモの分析
* gooラボAPIを用いた形態素解析による自動タグ生成
* DistilBERTを用いたメモの感情判定


## 開発技術

### 活用した技術

#### API・データ

* DistilBERT
* gooラボAPI

#### フレームワーク・ライブラリ・モジュール

* React
* Ruby on Rails
* docker


### 独自技術

#### ハッカソンで開発した独自機能・技術

* Reactを用いたアプリケーションのデザインやルーティングすべて
* Ruby on Railsを用いたAPIの作成やデータベースの管理など

<!--
#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
* 
-->
