$$(document).on('page:afterin', '.page[data-name="company-meeting"]', function () {
    showSurveyData();
    showAnswerData();
    //Show the summary of the answers if the user is admin
    document.getElementById('segment-area').style.display = userAdmin ? 'flex' : 'none';
});