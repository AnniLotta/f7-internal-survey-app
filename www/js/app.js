// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
  name: 'Survey app', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element
  statusbar: {
    enabled: false,
  },
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main');

let openSurvey = ''; //currently open survey
let allAnswers = []; //all the answers in the database
let userAdmin = false;  //is the current user an admin

function setActiveButton(firstButton, secondButton, index) {
  if (index === 0) {
    firstButton.classList.add("button-active");
    secondButton.classList.remove("button-active");
  } else {
    secondButton.classList.add("button-active");
    firstButton.classList.remove("button-active");
  }
}

// 表示切り替え処理 - Change view between answer form and answers summary
function changeView(index) {
  const firstButton = document.getElementById("first-button");
  const secondButton = document.getElementById("second-button");
  setActiveButton(firstButton, secondButton, index);
  if (index === 1) {
      document.getElementById("survey-container").style.display = 'none';
      document.getElementById("report-container").style.display = 'block';
  } else {
      document.getElementById("report-container").style.display = 'none';
      document.getElementById("survey-container").style.display = 'block';
  }
  showAnswers();
}

// アンケート結果の表示処理 - Show a summary of the answers
async function showAnswers() {
  // アンケート結果をサマライズ
  const results = summaryAnswers(allAnswers);
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
      if (['function', 'object'].indexOf(typeof value) > -1) continue;
      if (['acl', 'createDate', 'objectId', 'survey', 'survey_id', 'updateDate', 'className', 'answerer'].indexOf(key) > -1) continue;
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