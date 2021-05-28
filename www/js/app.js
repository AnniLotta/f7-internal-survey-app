const applicationKey = '60c90300b22f3ea853fe3ab920ca3893a1db2505bf6f3105d196995b8a61b477';
const clientKey = 'a44e2b94f2997de88a2a1da05c525e7ccf31f5d6892d1d814f7a79c2749ced0d';
const ncmb = new NCMB(applicationKey, clientKey);

// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
  name: 'My App', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main');

let openSurvey = '';

function showSurvey() {
  for (const key in openSurvey) {
    const dom = document.getElementById(`survey-${key}`);
    if (dom) {
      dom.innerHTML = openSurvey[key];
    }
  };
}

async function isAdmin() {
  const role = await ncmb.Role.equalTo('roleName', 'admin').fetch();
  const users = await role.fetchUser();
  return users.map(u => u.objectId).indexOf(ncmb.User.getCurrentUser().objectId) > -1;
}

function setActiveButton(firstButton, secondButton, index) {
  if (index === 0) {
    firstButton.classList.remove("button-inactive");
    secondButton.classList.add("button-inactive");
  } else {
    secondButton.classList.remove("button-inactive");
    firstButton.classList.add("button-inactive");
  }
}

// アンケートを保存する処理
async function saveSurvey() {
  // アンケート回答用のデータストアを準備
  const Answer = ncmb.DataStore('Answer');
  const answer = new Answer;
  answer
    .set('survey', openSurvey)
    .set('survey_id', openSurvey.objectId);
  // フォームを取得
  const form = app.form.convertToData(document.getElementById("survey-form"));

  // フォームの項目をアンケート回答クラスに設定
  for (const key of Object.keys(form)) {
    answer.set(key, form[key]);
  }
  // 権限設定
  const user = ncmb.User.getCurrentUser();
  const acl = new ncmb.Acl();
  acl
    .setUserReadAccess(user, true)
    .setUserWriteAccess(user, true)
    .setRoleReadAccess('admin', true)
  answer.set('acl', acl);
  try {
    // アンケートを保存
    await answer.save();
    return true;
  } catch (e) {
    return false;
  }
}

//アンケートを送信する処理
async function submitSurvey() {
  // アンケート結果をNCMBに保存（app.jsに記載）
  if (await saveSurvey.bind(this)()) {
    // 結果を保存できた場合
    // 一覧ページに戻る
    app.dialog.alert('回答しました', function () {
      app.views.main.router.back();
    });
  } else {
    // 結果が保存できなかった場合
    app.dialog.alert('エラーが発生しました');
  }
}

// アンケート結果の表示処理
async function showAnswers() {
  // アンケート結果の取得
  const answers = await getAnswers(openSurvey);
  // アンケート結果をサマライズ
  const results = summaryAnswers(answers);
  // HTMLの組み立て
  const html = [];
  for (const key in results) {
    html.push(`
    <div class="margin uppercase">${key}</div>
    <div class="list">
    <ul>`);
    for (const value in results[key]) {
      const num = results[key][value];
      html.push(`<li><div class="item-content"><div class="item-inner">`)
      html.push(`<div class="item-title">${value}</div>`);
      html.push(`<div class="item-after">${num}</div>`);
      html.push(`</div></div></li>`)
    }
    html.push(`</ul></div>`);
  }
  // HTMLの反映
  document.getElementById("report-list").innerHTML = html.join('');
}

// アンケート結果のサマライズ
function summaryAnswers(answers) {
  const results = {};
  answers.forEach(answer => {
    for (const key in answer) {
      const value = answer[key];
      // NCMBから取得される不要なデータを除外
      if (['function', 'object'].indexOf(typeof value) > -1) continue;
      if (['acl', 'createDate', 'objectId', 'survey', 'survey_id', 'updateDate', 'className'].indexOf(key) > -1) continue;
      // 結果をアンケート項目ごと、値ごとに集計
      if (!results[key]) {
        results[key] = {};
      }
      if (!results[key][value]) {
        results[key][value] = 0;
      }
      results[key][value]++;
    }
  });
  // 結果を返却
  return results;
}

// アンケート結果をNCMBから取得
async function getAnswers(survey) {
  return ncmb.DataStore('Answer')
    .equalTo('survey', {
      __type: 'Pointer',
      className: 'Survey',
      objectId: survey.objectId
    })
    .limit(1000)
    .fetchAll();
}

async function login() {
  const userName = document.getElementById("userName").value;
  const password = document.getElementById("password").value;
  // すでに登録済みの場合はエラーになるので、try/catchでエラーを潰します
  try {
    await registerUser(userName, password);
  } catch (e) {
  }
  try {
    // ログイン処理です。
    await ncmb.User.login(userName, password);
    // ログインできたら日報入力画面に遷移します
    app.views.main.router.back();
  } catch (e) {
    // エラーの場合ID/パスワード不一致になります
    app.dialog.alert('ログイン失敗しました。ユーザ名、パスワードを確認してください');
    return false;
  }
}

function logout() {
  const user = ncmb.User.getCurrentUser();
  app.views.main.router.navigate('/login/');
  ncmb.User.logout(user.userName);
}

/*
  新規ユーザ登録処理
  引数：
    displayName：文字列型。表示名
    userName：文字列型。ユーザ名
    password：文字列型。パスワード
*/
async function registerUser(userName, password) {
  const user = new ncmb.User();
  user
    .set('userName', userName)
    .set('password', password);
  await user.signUpByAccount();
}