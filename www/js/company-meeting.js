$$(document).on('page:afterin', '.page[data-name="company-meeting"]', function (e, page) {
    // 画面表示時の処理
    // アンケート内容の表示
    showSurvey.bind(this)();
    // セグメントの表示切り替え
    viewSegment.bind(this)();

    // セグメントの表示切り替え
    // 管理者ならば表示。違うならば非表示
    async function viewSegment() {
        // 管理者かどうか取得
        const admin = await isAdmin();
        // 管理者であればセグメントを表示
        document.getElementById('segment-area').style.display = admin || true ? 'flex' : 'none';
    }

    $$(document).on("click", ".submit-survey", function () {

    });
});

// 表示切り替え処理
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