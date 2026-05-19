# GitHub Desktop 運用マニュアル（初心者向け）

GitHubを一度も使ったことがない方向けに、ゼロから運用開始までの手順をまとめます。
所要時間：初回セットアップ約30分。日々の更新作業は1〜3分で済みます。

---

## 用語ミニ辞典

これだけ知っていれば困りません。

| 用語 | 意味 |
|---|---|
| **リポジトリ（repository）** | ファイル一式を入れる「箱」。今回のプロジェクト全体を指す |
| **コミット（commit）** | 変更内容を「ここまでの状態」として記録する操作。スナップショット |
| **プッシュ（push）** | ローカルPCの変更をGitHubサーバへアップロード |
| **プル（pull）** | GitHubサーバの変更をローカルPCへダウンロード（自分以外も編集する場合に必要） |
| **クローン（clone）** | GitHubのリポジトリをローカルPCにコピーしてくる初回操作 |
| **GitHub Pages** | GitHubリポジトリ内のHTMLをWebサイトとして公開する機能 |

---

## STEP 0：必要なものの準備

| 項目 | 入手先 | 備考 |
|---|---|---|
| GitHubアカウント | https://github.com/signup | 無料 |
| GitHub Desktop | https://desktop.github.com/ | 無料、Windows版あり |
| ブラウザ | Chrome等 | Edge でも可 |

---

## STEP 1：GitHubアカウントを作る（既にお持ちなら飛ばしてOK）

1. https://github.com/signup にアクセス
2. メールアドレス・パスワード・ユーザー名（例：`kei-teacher`）を入力
3. メール認証を完了
4. プランは「Free」のままでOK

**重要：** ユーザー名は公開URLに使われます。後で変更すると面倒なので、シンプルなものを選んでください。

---

## STEP 2：GitHub Desktopをインストール＆サインイン

1. https://desktop.github.com/ から `GitHub Desktop` をダウンロード
2. インストーラを実行（特に設定変更不要、そのまま進めればOK）
3. 起動すると「Sign in to GitHub.com」が出るのでクリック
4. ブラウザが開いてGitHubのログイン画面 → ユーザー名とパスワードを入力
5. 「Authorize desktop」をクリック
6. ブラウザに「GitHub Desktopに戻ってください」と表示されるので、Desktopアプリに戻る
7. 「Configure Git」画面 → 名前とメールアドレスを確認して「Finish」

これでサインイン完了。

---

## STEP 3：リポジトリを作る

### 3-1. GitHubのWebサイトで新規リポジトリ作成

1. GitHubにブラウザでログイン
2. 右上の「+」ボタン → 「New repository」
3. 以下のように設定：

| 項目 | 設定値 |
|---|---|
| Repository name | 例：`study-app`（半角英数字とハイフンのみ） |
| Description | 例：「あマ指・はり師きゅう師 国試対策アプリ」（任意） |
| Public / Private | **Public** を選択 |
| Initialize this repository with: | 何もチェックしない |

4. 緑色の「Create repository」ボタンをクリック

### 3-2. GitHub Desktopにリポジトリを取り込む

作成後の画面に表示されるURL（例：`https://github.com/kei-teacher/study-app.git`）をコピーして、

1. GitHub Desktopに戻る
2. 「File」メニュー → 「Clone repository...」
3. 「URL」タブを選択
4. URL欄にコピーしたURLを貼り付け
5. Local pathで保存先フォルダを指定（例：`C:\Users\<ユーザー名>\Documents\GitHub\study-app`）
6. 「Clone」をクリック

これでローカルPCに空のリポジトリフォルダが作られます。

---

## STEP 4：ファイルを配置する

1. STEP 3-2で指定したフォルダをエクスプローラで開く（例：`C:\Users\<名前>\Documents\GitHub\study-app`）
2. 私が作成したファイル一式を、このフォルダにすべてコピー：

```
study-app/  ← このフォルダ内に配置
├── index.html
├── README.md
├── .nojekyll
├── data/
│   └── questions.json
└── docs/
    ├── GitHub_Desktop_マニュアル.md
    ├── 設計書.md
    └── 運用ガイド.md
```

`.nojekyll` は中身が空のファイルですが、**必ず配置してください**（GitHub Pagesの正常動作に必要）。

---

## STEP 5：最初のコミットとプッシュ

1. GitHub Desktopを開くと、左側に追加されたファイル一覧が表示されているはず
2. 左下の「Summary」欄に「初回コミット」と入力
3. 「Description」欄は空でOK
4. 青い「Commit to main」ボタンをクリック
5. コミット後、画面上部に「Push origin」ボタンが表示される → クリック

これでGitHubサーバにファイルがアップロードされます。

確認方法：ブラウザでGitHubのリポジトリページを開く → ファイルが並んでいればOK。

---

## STEP 6：GitHub Pages を有効化する

1. ブラウザでGitHubのリポジトリページを開く
2. 上部メニューの「Settings」をクリック
3. 左サイドバーの「Pages」をクリック
4. 「Build and deployment」セクションで以下を設定：

| 項目 | 設定値 |
|---|---|
| Source | 「Deploy from a branch」 |
| Branch | 「main」、フォルダは「/ (root)」 |

5. 「Save」をクリック
6. 数分待つと、上部に **「Your site is live at https://<ユーザー名>.github.io/<リポジトリ名>/」** と表示される

このURLが、友人に共有する**アプリのURL**です。

**注意：** 反映に5〜10分かかることがあります。すぐに404でも慌てず待ってください。

---

## STEP 7：動作確認

1. 表示されたURLをスマホ・PCのブラウザで開く
2. 「問題データを更新しました（ver.2026.5.18）」のトーストが出れば成功
3. 各メニュー（演習・履歴など）が動作することを確認
4. 設定 → 「📥 出力」でバックアップJSONがダウンロードされれば完璧

---

## 日々の更新作業（問題追加・修正）

セットアップ後、問題データを追加・修正する流れです。

### A. 問題データだけ変更する場合（一番多い）

1. ローカルの `data/questions.json` をテキストエディタで開く（VS Code推奨。メモ帳でも可）
2. `questions` 配列に問題を追加 or 修正
3. **`questionDataVersion` を新しい日付に更新**（例：`"2026.5.18"` → `"2026.6.1"`）
   - これを忘れると、利用者の端末で更新が反映されません
4. ファイル保存
5. GitHub Desktopを開く
6. 左側に変更されたファイル（`data/questions.json`）が表示される
7. Summary欄に「問題を3問追加」など分かりやすい説明を入力
8. 「Commit to main」→「Push origin」
9. 数分後、利用者がアプリを開き直すと自動的に新しい問題が反映される

### B. アプリ本体（index.html）を変更する場合

1. `index.html` を編集
2. **`APP_VERSION` を新しい日付に更新**（例：`'2026.5.18'` → `'2026.6.1'`）
3. 以下STEP 7と同じ（Commit & Push）

---

## トラブル対処

### Q. プッシュしたのにサイトに反映されない
- 反映に5〜10分かかります。ブラウザのキャッシュをクリア（Ctrl + Shift + R）して再読み込み
- それでもダメな場合は、GitHubリポジトリページの「Actions」タブで状態を確認
- 「Settings → Pages」で「Source」が正しく「main」になっているか再確認

### Q. JSONファイルを編集したら問題が出なくなった
- JSON構文エラーの可能性大。`{` `}` `[` `]` `,` のバランス、`"` の閉じ忘れに注意
- 心配ならコミット前に https://jsonlint.com で構文チェックすると安全
- ブラウザの開発者ツール（F12）→ Consoleタブにエラーが出ているはず

### Q. 間違って消してしまった
- GitHub Desktopの「History」タブで過去のコミットを確認できる
- 各コミットの右クリック → 「Revert this commit」で取り消し可能
- どうしても困ったら、過去のコミットの状態に丸ごと戻すこともできる（要相談）

### Q. ファイルがgitに認識されない
- ファイル名に全角スペースや特殊文字が入っていないか確認
- `.nojekyll` のような先頭ドットファイルは Windowsエクスプローラで非表示になっている場合あり

### Q. 「Authentication failed」と出る
- GitHub Desktopで「File → Options → Accounts」からサインインし直す
- 2段階認証を有効にしている場合はパーソナルアクセストークンが必要なことも

---

## 友人への共有メッセージ例

```
学習アプリを以下URLで公開しました。
https://<ユーザー名>.github.io/<リポジトリ名>/

【使い方】
・ブラウザで開くだけで使えます（インストール不要）
・スマホの「ホーム画面に追加」でアプリのように起動できます
・学習履歴は各端末に保存されます（自動同期はされません）
・5日ごとにバックアップを促す通知が出ます
・「📥 出力」ボタンでバックアップ、「📤 取込」で復元できます

【iPhoneの注意】
7日以上開かないとデータが消える場合があります。
週1回は起動するか、定期的にバックアップしてください。
```

---

## 補足：避けて通れない注意点

- **Publicリポジトリなので、問題データは第三者からも閲覧可能です**。URLが流出すると誰でもアクセスできます。
- 友人内で完結する利用なので大きな問題にはなりにくいですが、SNSやブログ等での共有は控えてもらってください。
- リポジトリのURL（`https://github.com/<ユーザー名>/<リポジトリ名>`）と公開サイトのURL（`https://<ユーザー名>.github.io/<リポジトリ名>/`）は別物です。両方とも公開ですが、友人にはサイトURLのほうだけ伝えれば十分です。
