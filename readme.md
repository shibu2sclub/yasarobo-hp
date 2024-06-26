# やさしいロボコンホームページ
[https://yasarobo.sclub.dev](https://yasarobo.sclub.dev)

## 公開の仕組み
GitHub Pagesの独自ドメイン機能とsclub.devのDNS設定。自前のサーバを持たない。

## 年度の更新
* ```/data/```直下に新しく年のディレクトリを作成する。
* 中に```news.json```と```information.json```を作成、またはコピペする。
* 内容を当年のものに変更する。
    * 現時点では1つ以上のnews（ホームページ開設報告で良い）と開催日時、場所など開催要項の情報がないとトップページが生成されません。
* ```common.json```の```pastYears```キーの値（配列）に前年の年を追加する（これで過去大会情報ページにリンクが掲載されます）。
* ```common.json```の```year```キーの値を当年に変更する（ここで読み込まれるデータの指定を行っているため、この値の変更で初めて切り替えが行われます）。
* OGP・Twitter cardの画像を置き換えます。リンクをSNSに投稿した際に画像が添付されるやつです。横幅800px×高さ450px程度に画面を小さくして、スクリーンショットを撮り、```/img/card.png```として保存することで反映されます。
    * 参考：[https://rakko.tools/tools/9/](https://rakko.tools/tools/9/)

データファイルの詳しい記法と記入例は後述します。

## データの書き方（年度問わず共通）
### common.json
サイト全体に関する設定のJSONファイル。

```json:common.json
{
    "year": 2023,
    "pastYears": [
        2021,
        2022
    ]
}
```

* year: トップページに掲載されている=最新のコンテストの開催年度。（第〇回大会のような大会のカウントとしての数値、1月～3月の場合は開催当日の年月日とは相違が生じる。）
* pastYears: 過去大会の年度リスト。これがない場合はメニューに過去大会情報は表示しない。

### news-label-setting.json
ニュースに付与するラベルの設定。

```json:news-label-setting.json
[
    {
        "id": "important",
        "color": "#DD4141",
        "name": "重要"
    },
    {
        "id": "visitor",
        "color": "#24633B",
        "name": "来場者"
    },
    {
        "id": "contestant",
        "color": "#24633B",
        "name": "出場者"
    },
    {
        "id": "others",
        "color": "#3C3C3C",
        "name": "その他"
    }
]
```

* id: ```news.json```で指定するラベル名。
* color: ラベルの背景色。```#xxxxxx```表記（16進数）と```red```などの色表記の両方に対応。
* name: 実際のニュースで表示されるラベルの名称。

### index-slideshow.json
トップページ最上部のスライドショーの設定。

```json:index-slideshow.json
[
    {
        "img": "/img/index-slideshow/dikefalos.webp"
    },
    {
        "img": "/img/index-slideshow/2022yasarobo-3.webp",
        "caption": "やさしいロボコン2022年プレ大会の様子"
    }
]
```

* img: 画像の場所。基本的に絶対パスを推奨。
* （任意）caption: 画像の説明文。全角20字以内を推奨。

### index-video.json
トップページ最上部でPC版のみ表示される動画の設定。

```json:index-video.json
{
    "video-enabled": true,
    "id": "cW514x4bg20",
    "center": {
        "x": 50,
        "y": 50
    },
    "start": 93
}
```

* video-enabled: PC版で動画を表示するか。trueで表示、falseではスライドショーを表示。
* id: YouTubeの動画のID。URLに含まれる。
* start: 動画の再生開始時間。途中から再生できる。

#### common.jsonのyearが影響する範囲
yearは非常に広範な範囲で用いているため、この場で影響範囲を記載している。

* ホームページ全体で表示に使用するデータの年度
* ロゴの年度部分

## データの書き方（大会（=年度）ごと）
年度のフォルダ内に存在。年度の変更は「年度の更新」章を参照のこと。

### information.json
大会の開催情報。トップページ~~とトップページ含む全ての「アクセス」~~ において用いている。

```json:information.json
{
    "date": "2023.12.3",
    "time": "11:00 ~ 15:00",
    "header-highlight-text": "要観覧予約",
    "timeDetail": "午前中はロボット調整の時間とし、ロボコンの競技は11時頃に開始、15時頃までには終了する予定です。<br>なおこの予定は変更されることもあります。決まり次第HPにてご連絡いたします。",
    "place": {
        "name": "渋谷教育学園渋谷中学高等学校",
        "name2": "6階 理科室3",
        "postCode": "150-0002",
        "address": "東京都渋谷区渋谷1-21-18",
        "transportation": [
            {
                "place": "渋谷駅からお越しの方",
                "detail": [
                    "東急・東京メトロ B1出口から徒歩7分",
                    "JR ハチ公改札口・南改札口から徒歩15分",
                    "京王井の頭線 中央口から徒歩20分"
                ]
            },
            {
                "place": "明治神宮前＜原宿＞駅からお越しの方",
                "detail": [
                    "東京メトロ 4番・7番出口から徒歩15分"
                ]
            },
            {
                "place": "原宿駅からお越しの方",
                "detail": [
                    "JR山手線 東口から徒歩25分"
                ]
            }
        ],
        "googleMap": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.539293618878!2d139.7005870762712!3d35.66372083093489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ca6441b7da1%3A0x322d8cd231d2a237!2z5riL6LC35pWZ6IKy5a2m5ZyS5riL6LC35Lit5a2m5qCh44O76auY562J5a2m5qCh!5e0!3m2!1sja!2sjp!4v1696476210042!5m2!1sja!2sjp"
    },
    "organizer": [
        {
            "name": "渋谷教育学園渋谷中学高等学校 理科部ロボコン班",
            "link": "https://shibu2rikabu.mystrikingly.com/"
        }
    ],
    "inquiry": {
        "name": "渋谷教育学園渋谷中学高等学校 理科部ロボコン班 やさしいロボコン担当",
        "linkName": "yasarobo@googlegroups.com",
        "link": "mailto:yasarobo@googlegroups.com"
    },
    "rule": {
        "name": "ルール・開催要項（原案・PDF）",
        "link": "https://drive.google.com/file/d/1f8vbpx1p_VoEAQCKo9FgvEAp0db_YkO-/view?usp=drive_link"
    }
}
```

* date: 開催日。記法は```yyyy.mm.dd```で、一桁の場合も基本0はつけないで良い。
* time: 開催時刻。
* （任意）timeDetail: 開催時刻に関する詳細情報。HTMLタグで書ける。
* header-highlight-text: トップページの緑色のヘッダーにおける白抜きになっている部分の文字。開催形態などを書く。
* place: 開催場所。
    * name: 開催施設の名前。
    * name2: 部屋の名前。
    * postCode: 郵便番号。ハイフンは入れる。
    * address: 住所。
    * transportation: 公共交通機関によるアクセス方法を配列で記載。そのまま表示される。
        * place: 特定の駅
        * detail: 各社からの出口、所要時間を配列で記載。そのまま表示される。
    * googleMap: Google Mapの埋め込みタグ入手時の```src```内にあるURL。
* organizer: 主催者の一覧。複数の主催者を配列で記載。
    * name: 主催者名
    * （任意）link: 主催者のURL
* inquiry: お問い合わせ
    * name: お問い合わせ先の名前
    * linkName: お問い合わせ先のリンク名。メールアドレスかリンク先の名前を記載する。
    * link: お問い合わせ先のURL（メールアドレスなら```mailto:```をつけること）
* rule: ルール・開催要項へのリンク（PDF）
    * name: リンク名
    * link: URL

### news.json
ニュース記事のJSONファイル。

```json:setting.json
[
    {
        "id": "2023-2",
        "title": "やさしいロボコン開催決定！",
        "label": [
            "important"
        ],
        "date": "2023.10.07",
        "article": [
            "やさしいロボコンの開催が決定しました！",
            "知能ロボコンを知っていますか？毎年6月頃に宮城県仙台市で行われる、全自動で動く自律ロボットのコンテストです。",
            "この知能ロボコンの特徴は、「Festival（お祭り）」だということ。勝ち負けだけのロボコンじゃない。技術やアイデアを持ち寄って、みんなで楽しむ。",
            "私たち渋渋理科部では、「知能ロボコンの会場の雰囲気を伝えたい」「知能ロボコンに出てみたい、実際に見てみたい」という人を増やしたいと思っており、知能ロボコンの魅力を伝えるべくこの冬に「やさしいロボコン」の開催を計画しています。",
            "「やさしいロボコン」はオープン大会です。もともと校内大会で始めたものですが、お祭りはみんなで楽しまないと。賞品とかはないですが、「知能ロボコンの半年前に完成させた」という達成感と自信は、お土産になるかと思います。",
            "ぜひ参戦してみませんか？見学・観覧も大歓迎です！初心者の方から経験者の方まで、ぜひ来てください！スタッフや参加者たちと、ロボコンについて熱く語りあえる場を提供できたらと考えています。",
            "開催日時：2023年12月3日 11時～15時<br>開催場所：渋谷教育学園渋谷中学高等学校",
            "詳細はトップページをご覧ください。"
        ]
    },
    {
        "id": "2023-1",
        "title": "ホームページを公開しました！",
        "label": [
            "others"
        ],
        "date": "2023.10.07"
    }
]
```

```{}```でニュース1件。配列順序はそのまま記事の順序になり、上から順に表示。基本的には上に重要なニュースor新しいニュースを載せる。

* id: 記事ID。URLに反映される。このファイルの中で一意に設定。```?```や```&```、``` ```（半角スペース）は使用不可能。全角文字も避ける。
* title: 記事タイトル。
* label: 記事のラベル（カテゴリ）。複数配置も可能な記法としているが基本的に一つにするように（対応していない）。ラベルの種類は```news-tag-setting.json```で設定する。
* date: 日付。そのまま表示される。仕様上はどのような文字列でも問題ないが、デザインにおいて基本的には```yyyy.mm.dd```表記を想定しているため、一桁の場合は先頭に0を入れることを推奨。
* article: 記事本文。1段落ごとに1項目で配列とする。

### record-setting.json
競技記録のデータ体裁に関する設定。以下は2023年度のやさしいロボコンの設定。

```json:record-setting.json
{
    "showRecord": true,
    "showAward": true,
    "type": "default",
    "courseList": [
        {
            "name": "チャレンジャーズコース",
            "id": "C",
            "ruleCaption": "ボールを自動で探索、取得し、色を認識してゴールに入れるミッションです。",
            "baseRuleDesc": [
                "競技者は、競技開始を宣言した後は手動での操作は出来ず、ロボットが自動で自律して動作することになります。",
                "競技をやり直したい場合（例：ロボットが動作不調に陥った場合など）は、競技者は3回まで「リトライ」をすることができます。リトライにおいてはボールは全て置き直され、それまでに取った得点も全て無効となります。"
            ],
            "pointRuleDesc": [
                "競技台には赤色、黄色、青色のゴムボールが各色5個、合計15個置かれています。正しい色のゴールにボールを入れた場合は3点、誤った色の場合は1点が加点されます。",
                "またこれとは別に、自由ボールというルールが存在します。競技者は競技開始前やリトライ時に、テニスボール1個を受け取ります。このボールは競技台上に置くことも、ロボットに持たせることも可能です。自由ボールはどのゴールに入れても5点が加点されます。",
                "最高得点は50点です。"
            ],
            "point": [
                {
                    "id": "R",
                    "name": "赤色ボール（色正解）",
                    "value": 3
                },
                {
                    "id": "Y",
                    "name": "黄色ボール（色正解）",
                    "value": 3
                },
                {
                    "id": "B",
                    "name": "青色ボール（色正解）",
                    "value": 3
                },
                {
                    "id": "r",
                    "name": "赤色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "y",
                    "name": "黄色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "b",
                    "name": "青色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "T",
                    "name": "自由ボール",
                    "value": 5
                }
            ]
        },
        {
            "name": "マスターズコース",
            "id": "M",
            "ruleCaption": "様々な物体を自動で探索、取得し、色を認識してゴールに入れたり移動させたりするミッションです。",
            "baseRuleDesc": [
                "競技者は、競技開始を宣言した後は手動での操作は出来ず、ロボットが自動で自律して動作することになります。",
                "競技をやり直したい場合（例：ロボットが動作不調に陥った場合など）は、競技者は3回まで「リトライ」をすることができます。リトライにおいてはボールは全て置き直され、それまでに取った得点も全て無効となります。"
            ],
            "pointRuleDesc": [
                "競技台には赤色のゴムボールが6個、青色のゴムボールが2個、スチール缶が立てられた状態で3本、アルミ缶が寝かされた状態で1本、水の入ったペットボトル（ウォーターボトル）が1本置かれています。",
                "ゴムボールは正しい色のゴールに入れると4点、スチール缶は黄色ゴールに入れると6点、アルミ缶は黄色ゴールに入れると10点が加点されます。誤ったゴールに入れると1点です。",
                "ウォーターボトルは中央段差上に移動させると15点が入ります。移動させた際のウォーターボトルの姿勢は問いません。中央段差上に乗っていない場合は0点です。",
                "またこれとは別に、自由ボールというルールが存在します。競技者は競技開始前やリトライ時に、テニスボール1個を受け取ります。このボールは競技台上に置くことも、ロボットに持たせることも可能です。自由ボールはどのゴールに入れても5点が加点されます。",
                "マスターズコースでは自由ボール以外の対象物をすべてゴールした状態で、ロボットがスタート位置（スタートエリア）に戻り、競技者が競技終了を宣言した場合は、リターンボーナスとして10点が加点されます。",
                "最高得点はリターンボーナスを含めて90点です。"
            ],
            "point": [
                {
                    "id": "R",
                    "name": "赤色ボール（色正解）",
                    "value": 4
                },
                {
                    "id": "B",
                    "name": "青色ボール（色正解）",
                    "value": 4
                },
                {
                    "id": "r",
                    "name": "赤色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "b",
                    "name": "青色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "S",
                    "name": "スチール缶（色正解）",
                    "value": 6
                },
                {
                    "id": "s",
                    "name": "スチール缶（色不正解）",
                    "value": 1
                },
                {
                    "id": "A",
                    "name": "アルミ缶（色正解）",
                    "value": 10
                },
                {
                    "id": "a",
                    "name": "アルミ缶（色不正解）",
                    "value": 1
                },
                {
                    "id": "T",
                    "name": "自由ボール",
                    "value": 5
                },
                {
                    "id": "W",
                    "name": "ウォーターボトル",
                    "value": 10
                },
                {
                    "id": "M",
                    "name": "リターンボーナス",
                    "value": 10
                }
            ]
        },
        {
            "name": "やさしいコース",
            "id": "Y",
            "ruleCaption": "ボールを競技者が戦略的に配置し、自動で探索、取得し、色を認識してゴールに入れるミッションです。",
            "baseRuleDesc": [
                "競技者は、競技開始を宣言した後は手動での操作は出来ず、ロボットが自動で自律して動作することになります。",
                "競技をやり直したい場合（例：ロボットが動作不調に陥った場合など）は、競技者は3回まで「リトライ」をすることができます。リトライにおいてはボールは全て競技者が置き直します。それまでに取った得点も全て無効となります。"
            ],            
            "pointRuleDesc": [
                "競技台には赤色、黄色、青色のゴムボールが各色4個、合計12個と、スポンジボール3個、すなわち15個のボールを競技者自ら置きます。",
                "ゴムボールを配置できる位置は左エリア（ゴール側）と右エリア（他コースのボール配置位置）の両方です。ただし後述の通り左エリアと右エリアで得点に差が生じます。スタート台（スタートエリア）には配置できません。スポンジボールは右エリアにのみ配置できます。",
                "右エリアに配置されたゴムボールは、正しい色のゴールにボールを入れた場合は6点、誤った色の場合は2点が加点されます。",
                "左エリアに配置されたゴムボールはゴールの位置を問わず1点、スポンジボールはゴールの位置を問わず4点が加点されます。",
                "またこれとは別に、ボーナス得点（当頁ではオリジナリティボーナスと表記）が存在します。特定の条件を満たし、十分に自作のロボットとみなされたロボットについては、ゴールしたボール1個あたり1点が加点されます。",
                "最高得点はオリジナリティボーナスを含めて99点です。"
            ],
            "point": [
                {
                    "id": "R",
                    "name": "右側赤色ゴムボール（色正解）",
                    "value": 6
                },
                {
                    "id": "Y",
                    "name": "右側黄色ゴムボール（色正解）",
                    "value": 6
                },
                {
                    "id": "B",
                    "name": "右側青色ゴムボール（色正解）",
                    "value": 6
                },
                {
                    "id": "r",
                    "name": "右側赤色ゴムボール（色不正解）",
                    "value": 2
                },
                {
                    "id": "y",
                    "name": "右側黄色ゴムボール（色不正解）",
                    "value": 2
                },
                {
                    "id": "b",
                    "name": "右側青色ゴムボール（色不正解）",
                    "value": 2
                },
                {
                    "id": "M",
                    "name": "左側ゴムボール",
                    "value": 1
                },
                {
                    "id": "S",
                    "name": "右側スポンジボール",
                    "value": 4
                },
                {
                    "id": "O",
                    "name": "オリジナリティボーナス",
                    "bonusType": "add",
                    "value": 1,
                    "targetID": [
                        "R",
                        "Y",
                        "B",
                        "r",
                        "y",
                        "b",
                        "M",
                        "S"
                    ]
                }
            ]
        }
    ],
    "scoreList":[
        {
            "name": "ベストスコア",
            "id": "12best",
            "calculateType": "best",
            "list": [
                "1st",
                "2nd"
            ],
            "default": true,
            "priority": 1,
            "desc": "1回目と2回目の試技における最高点です。最終順位の決定もこの得点で行います。"
        },
        {
            "name": "1回目",
            "id": "1st",
            "time": "5:00:00",
            "priority": 2
        },
        {
            "name": "2回目",
            "id": "2nd",
            "time": "5:00:00",
            "priority": 3
        }
    ]
}
```

* showRecord: 全体のナビメニューに競技記録・ロボット一覧を表示するかの設定。表示できる状態となったら```true```に。なお、このファイル自体存在しない時は```false```扱いとなる。
* showAward: 受賞者リストを表示するかどうか。
* type: ```simple```、```default```
    * simple: 集計結果の得点のみ。
    * default: ボールや缶の取得状況、色を含んだデータ。```simple```に加えて得点の内訳が表示される。
* courseList: 各コースに関する設定。配列で渡す。
    * name: コース名
    * id: ID、ゼッケン番号1文字目と一致
    * point: 得点・UI設定。各種で配列に。
        * id: 得点文字列
        * name: 得点の名前
        * value: 得点やボーナスポイントの数値
        * （任意）bonusType: ボーナスポイントなどの算出タイプ
            * add: ```targetID```で指定した得点1回ずつに対して加算
            * multiply: ```targetID```で指定した得点1回ずつに対して積算
        * （bonusType指定時のみ）targetType: ```add```, ```multiply```を行う得点ID
* scoreList: 各試技に関する設定。実際の試技並びに算出得点ともにこちらで指定する。配列で渡す。なお順番はそのまま表示順に使用される。
    * name: 名前
    * id: 管理用ID。```id```, ```name```, ```team```, ```belonging```, ```result```といったロボット情報のキーと重複しないようにする。最初の文字に```!```を含まないようにする。
    * （実際の競技）time: 競技時間
    * （算出点）calculateType: 算出方法。なおこの算出は合計点のみで行い、競技点や審査点は考慮しない。
        * max: 最大値。この場合は最大値となった競技に網掛けがつく。
        * sum: 合計値
    * （任意）default: ランキングを表示した際にデフォルトで表示したいもの。trueを入れる。存在しない場合は一番最初の試技が表示される。（なお競技記録トップページの最優秀賞・優秀賞は判定に用いた得点（priority）を表示する。）
    * priority: 得点（・競技時間）優先順位。最も小さい値に設定されたものが最優先で、最優秀賞などの算出、最初の表示での順番に用いられる。それで順序がつけられない場合は2へ（各優先度での並べ替えは合計得点→時間で行われ、同率の場合は次の優先度を見る。基本的には予選敗退などで順位がついていない場合を想定）。
    * （任意）desc: スコアの説明。出場者数が減る場合（予選→決勝など）はその説明も記載できる。（未実装）

#### 知能ロボットコンテストのルールでの設定
```json:record-setting.json
{
    "showRecord": true,
    "showAward": true,
    "type": "default",
    "courseList":[
        {
            "name": "チャレンジャーズコース",
            "id": "C",
            "ruleCaption": "ボールを自動で探索、取得し、色を認識してゴールに入れるミッションです。",
            "baseRuleDesc": [
                "競技者は、競技開始を宣言した後は手動での操作は出来ず、ロボットが自動で自律して動作することになります。",
                "競技をやり直したい場合（例：ロボットが動作不調に陥った場合など）は、競技者は3回まで「リトライ」をすることができます。リトライにおいてはボールは全て置き直され、それまでに取った得点も全て無効となります。"
            ],
            "pointRuleDesc": [
                "競技台には赤色、黄色、青色のゴムボールが各色5個、合計15個置かれています。正しい色のゴールにボールを入れた場合は3点、誤った色の場合は1点が加点されます。",
                "またこれとは別に、自由ボールというルールが存在します。競技者は競技開始前やリトライ時に、テニスボール1個を受け取ります。このボールは競技台上に置くことも、ロボットに持たせることも可能です。自由ボールはどのゴールに入れても5点が加点されます。",
                "最高得点は50点です。"
            ],
            "point": [
                {
                    "id": "R",
                    "name": "赤色ボール（色正解）",
                    "value": 3
                },
                {
                    "id": "Y",
                    "name": "黄色ボール（色正解）",
                    "value": 3
                },
                {
                    "id": "B",
                    "name": "青色ボール（色正解）",
                    "value": 3
                },
                {
                    "id": "r",
                    "name": "赤色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "y",
                    "name": "黄色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "b",
                    "name": "青色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "T",
                    "name": "自由ボール",
                    "value": 5
                }
            ]
        },
        {
            "name": "マスターズコース",
            "id": "M",
            "ruleCaption": "様々な物体を自動で探索、取得し、色を認識してゴールに入れたり移動させたりするミッションです。",
            "baseRuleDesc": [
                "競技者は、競技開始を宣言した後は手動での操作は出来ず、ロボットが自動で自律して動作することになります。",
                "競技をやり直したい場合（例：ロボットが動作不調に陥った場合など）は、競技者は3回まで「リトライ」をすることができます。リトライにおいてはボールは全て置き直され、それまでに取った得点も全て無効となります。"
            ],
            "pointRuleDesc": [
                "競技台には赤色のゴムボールが6個、青色のゴムボールが2個、スチール缶が立てられた状態で3本、アルミ缶が寝かされた状態で1本、水の入ったペットボトル（ウォーターボトル）が1本置かれています。",
                "ゴムボールは正しい色のゴールに入れると4点、スチール缶は黄色ゴールに入れると6点、アルミ缶は黄色ゴールに入れると10点が加点されます。誤ったゴールに入れると1点です。",
                "ウォーターボトルは中央段差上に移動させると15点が入ります。移動させた際のウォーターボトルの姿勢は問いません。中央段差上に乗っていない場合は0点です。",
                "またこれとは別に、自由ボールというルールが存在します。競技者は競技開始前やリトライ時に、テニスボール1個を受け取ります。このボールは競技台上に置くことも、ロボットに持たせることも可能です。自由ボールはどのゴールに入れても5点が加点されます。",
                "マスターズコースでは自由ボール以外の対象物をすべてゴールした状態で、ロボットがスタート位置（スタートエリア）に戻り、競技者が競技終了を宣言した場合は、リターンボーナスとして10点が加点されます。",
                "最高得点はリターンボーナスを含めて90点です。"
            ],
            "point": [
                {
                    "id": "R",
                    "name": "赤色ボール（色正解）",
                    "value": 4
                },
                {
                    "id": "B",
                    "name": "青色ボール（色正解）",
                    "value": 4
                },
                {
                    "id": "r",
                    "name": "赤色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "b",
                    "name": "青色ボール（色不正解）",
                    "value": 1
                },
                {
                    "id": "S",
                    "name": "スチール缶（色正解）",
                    "value": 6
                },
                {
                    "id": "s",
                    "name": "スチール缶（色不正解）",
                    "value": 1
                },
                {
                    "id": "A",
                    "name": "アルミ缶（色正解）",
                    "value": 10
                },
                {
                    "id": "a",
                    "name": "アルミ缶（色不正解）",
                    "value": 1
                },
                {
                    "id": "T",
                    "name": "自由ボール",
                    "value": 5
                },
                {
                    "id": "W",
                    "name": "ウォーターボトル",
                    "value": 10
                },
                {
                    "id": "M",
                    "name": "リターンボーナス",
                    "value": 10
                }
            ]
        }
    ],
    "scoreList":[
        {
            "name": "1次予選",
            "id": "1st",
            "time": "5:00:00",
            "default": true,
            "priority": 4
        },
        {
            "name": "敗者復活戦",
            "id": "revival",
            "time": "5:00:00",
            "priority": 3
        },
        {
            "name": "2次予選",
            "id": "2nd",
            "time": "5:00:00",
            "priority": 2
        },
        {
            "name": "決勝",
            "id": "final",
            "time": "10:00:00",
            "priority": 1
        }
    ]
}
```

### （任意）ロボットの画像の保管場所
```/data/{year}/robot-img/```内に画像を入れると表示されます。画像のファイル名はゼッケン番号としてください。画像が存在しない場合は表示しません。ファイルの種類は基本的にほとんどのブラウザで表示できる```jpeg```、```png```、```webp```のいずれかとすることを推奨します。また画像は横長4:3程度が望ましいです。

### record.json
競技記録。```{}```でロボット1組。

#### typeがdefaultの場合
```json:record.json
[
    {
        "id": "C01",
        "name": "くらげ君",
        "team": "しぶしぶ「寿」",
        "belonging": "渋渋理科部",
        "result": {
            "1st": {
                "contest": [
                    "TBYrrr",
                    "TRRBBYYYYRRRBBB"
                ],
                "remainTime": "1:20:15" 
            }
        }
    },
    {
        "id": "C04",
        "name": "mako-robo Surprising VIIctory",
        "team": "しぶしぶ「射」",
        "belonging": "渋谷中高理科部",
        "result": {
            "1st":{
                "contest": [
                    "TRYYRRRYBBBRBByy"
                ],
                "remainTime": "1:56:34"
            }
        }
    }
]
```

* ID: ゼッケン番号。1文字目でコース認識。
    * C: チャレンジャーズ
    * M: マスターズ
    * Y: やさしい
* name: ロボット名
* team: チーム名
* （任意）belonging: 所属
* （任意）category: ロボットの種類。配列で渡す。
* （任意）feature: ロボットの特徴の説明文。
* （任意）appeal: ロボットのアピールポイントの文。
* result: 結果。キーは```record-setting.json```で設定した通り。
    * 1st: 1回目
    * 2nd: 2回目
        * contest: 競技点情報（得点文字列）。競技した場合のみ記述。以下のルールに沿って文字を羅列。リトライごとに1個ずつの文字列。最後の文字列が最後の試技なので最終結果。なお以下の文字とポイントの対応は```record-setting.json```で設定された通り。今回は2023年度のやさしいロボコンの設定を示す。
            * R, Y, B: （黄はマスターズ以外）（やさしいは右エリアママボール）赤、黄、青ボール（色正解）
            * r, y, b: （黄はマスターズ以外）（やさしいは右エリアママボール）赤、黄、青ボール（色不正解）
            * T~~, t~~: **T**ennis ball（やさしい以外）テニスボール（色関係なし）
            * S: **S**teel（マスターズ）スチール缶（色正解）
            * s: **s**teel（マスターズ）スチール缶（色不正解）
            * A: **A**luminium（マスターズ）アルミ缶（色正解）
            * a: **a**luminium（マスターズ）アルミ缶（色不正解）
            * W: **W**ater bottle（マスターズ）ウォーターボトル
            * M~~, m~~: **M**ama ball（やさしい）左エリア用ママボール（色関係なし）
            * S~~, s~~: **S**ponge ball（やさしい）右エリア用スポンジボール（色関係なし）
            * M~~, m~~: **M**asters return bonus（マスターズ）リターンボーナス
            * O~~, o~~: **O**riginality bonus（やさしい）オリジナリティボーナス（先頭に表記が望ましい）
        * remainTime: 残り時間。```mm:ss:xx```のように書く。0はなくても補うが、基本的に分以外は一桁の場合先頭に0を付けることが望ましい。
        * （予約）contestTime：競技時間。```record-setting.json```の競技時間から```remainTime```を引いたもの。
        * （任意）contestPoint: 競技点、基本的には自動算出されるため不要。処理速度の問題が出た場合は先に入力しておくことも可能。
        * （任意）judgePoint: 審査点
        * （予約）sumPoint: 合計点 = 競技点＋審査点、内部で計算される。
        * （予約）source: ```calculateType```が```best```の場合、どのスコアを持ってきたかを提示。
        * （任意）retry: リトライ回数。未入力時は未表示。
        * （任意）remark: 備考。棄権や3分ルールなど特筆すべき結果だった場合はこちらに記載。

##### 特筆すべき点
* 棄権や3分ルールなどの失格など、競技結果が存在しない場合は```contest```、```remainTime```は書かないこと。
* 知能ロボコンの二次予選以降など出場していない場合は出場していないラウンド・試技のキーと要素を書かないこと。

#### typeがsimpleの場合
```json:record.json
[
    {
        "id": "C01",
        "name": "くらげ君",
        "team": "しぶしぶ「寿」",
        "belonging": "渋渋理科部",
        "result": {
            "1st": {
                "contest": {
                    "score": 50,
                    "retry": 1
                },
                "remainTime": "1:20:15" 
            }
        }
    }
]
```

異なる部分のみ記載する。
* contest: 競技点情報
    * score: 競技点（数値）
    * retry: リトライ回数

### record-award.json
受賞者に関するデータ。

```json:record-award.json
{
    "release": false,
    "award": [
        {
            "name": "大会委員長賞",
            "id": "C01",
            "desc": "大会委員長賞は、大会において最も優れたロボットに贈られる賞です。技術力やデザイン、チャレンジ性などのすべてにおいて「オクト君」は格段に優れており、大会委員長賞に選考しました。"
        },
        {
            "name": "最優秀技術賞",
            "id": "C02",
            "desc": "最優秀技術賞は、大会において最も優れた技術力を発揮したロボットに贈られる賞です。「dikefalos」はシンプルかつ非常に洗練された機構ながら、高い技術力を有しており、最優秀技術賞に選考しました。"
        },
        {
            "name": "特別賞",
            "id": "C04"
        }
    ]
}
```

各コースの最優秀賞と優秀賞は自動計算で表示される。その他の賞はここで設定を行う。なお、得点やロボット名などは自動で表示される。

* release: 受賞者をリリースするか。この時最優秀賞と優秀賞も自動計算の上で公開される。
* award: 得点以外での特別賞の一覧。配列で記載。
    * name: 賞の名前
    * id: ゼッケン番号。配列で渡した場合は複数人受賞。
    * （任意）desc: 受賞ロボットに対する講評、判断理由、賞に関する説明。

#### 最優秀賞・優秀賞の自動生成条件
* 1点以上を獲得している。
* 各コースの1位と2位。同率の場合は全て表示にしたいが現在は先のロボットのみ表示（issue）。
* 任意の設定は不可。（issue）

# 質問など
理科部ロボコン班Slack、理科部LINEで当該担当者を見つけていただき、メンション or DMを飛ばしてください。

渋渋17期 理科部ロボコン班OB・元部長
GitHub: @makochan1209