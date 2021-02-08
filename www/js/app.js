const applicationKey = 'YOUR_APPLICATION_KEY';
const clientKey = 'YOUR_CLIENT_KEY';
const ncmb = new NCMB(applicationKey, clientKey);


function showSurvey() {
  for (const key in this.data.survey) {
    const dom = this.querySelector(`.survey-${key}`);
    if (dom) {
      dom.innerHTML = this.data.survey[key];
    }
  };
}

async function isAdmin() {
  const role = await ncmb.Role.equalTo('roleName', 'admin').fetch();
  const users = await role.fetchUser();
  return users.map(u => u.objectId).indexOf(ncmb.User.getCurrentUser().objectId) > -1;
}

// アンケートを保存する処理
async function saveSurvey() {
  // アンケート回答用のデータストアを準備
  const Answer = ncmb.DataStore('Answer');
  const answer = new Answer;
  answer
    .set('survey', this.data.survey)
    .set('survey_id', this.data.survey.objectId);
  // フォームを取得
  const form = new FormData(this.querySelector('form'));
  // フォームの項目をアンケート回答クラスに設定
  for (const key of form.keys()) {
    answer.set(key, form.get(key));
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
