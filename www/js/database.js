
try {
    initFirebase(); // initialize Firebase    
    console.log('Firebase initialized')
} catch (e) {
    console.log("Error:", e)
    console.log('Firebase is not initialized.');
}

let loggedInUser = '';

//Detect log in and log out
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loggedInUser = user;
        app.views.main.router.back();
        //app.views.main.router.navigate('/home/');
        showSurveys();
    } else {
        loggedInUser = undefined;
        app.views.main.router.navigate('/login/');
    }
});

//Checks if the current user is an admin
function isAdmin() {
    db.collection('admins').onSnapshot((doc) => {
        doc.docs.forEach((doc) => {
            if (doc.data().email === loggedInUser?.email) userAdmin = true;
        })
    });
}

//Logs in or creates a new account if it doesn't yet exist
function tryLogin() {
    const email = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    firebase.auth()
        .fetchSignInMethodsForEmail(email) //Checking if there are sign in methods registered for the user
        .then((methods) => {
            if (methods.length > 0) login(email, password); //If there are some methods -> user exists
            else app.dialog.confirm('The user does not exist. Create a new user?', function () {
                createNewUser(email, password)
            });
        })
        .catch((error) => {
            $$('p').show();
            console.log("Error in login:", error);
        });

}

function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("Signed in as ", user);
        })
        .catch((error) => {
            console.log("Error in login: ", error);
        });
}

function logout() {
    firebase.auth().signOut().then(function () {
        console.log("Signed out.");
    }, function (error) {
        console.log("Sign out failed.", e);
    });
}

function createNewUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log("Signed in as ", user);
        })
        .catch((error) => {
            console.log("Error in creating a new user: ", error);
        });
}

// アンケートに回答済みか判定 - has the user answered the questionnaire
function answered(surveyId) {
    let isAnswered = false;
    for (let i = 0; i < allAnswers.length; i++) {
        if (allAnswers[i].answerer === loggedInUser?.email && allAnswers[i].survey_id === surveyId) {
            isAnswered = true;
            break;
        }
    }
    return isAnswered;
}

//Set survey data on the survey page
function showSurveyData() {
    for (const key in openSurvey) {
        const dom = document.getElementById(`survey-${key}`);
        if (dom) {
            dom.innerHTML = openSurvey[key];
        }
    };
}

//Open the survey page
function showSurvey(surveyId) {
    const docRef = db.collection("surveys").doc(surveyId);
    docRef.get().then((doc) => {
        if (doc.exists) {
            openSurvey = doc.data();
            openSurvey.id = surveyId;
            openSurvey.answered = answered(doc.data().answeredBy);
            app.views.main.router.navigate(doc.data().page);
        }
    });
}

//List all the surveys on the main page
function showSurveys() {
    db.collection('answers').onSnapshot((doc) => {
        allAnswers = [];
        doc.docs.forEach((doc) => {
            const answer = doc.data();
            allAnswers.push(answer)
        })

        db.collection('surveys').onSnapshot((doc) => {
            let result = '';
            doc.docs.forEach((doc) => {
                isEmpty = false;
                const survey = doc.data();
                result += `
            <div id="${doc.id}" class="survey-card card block block-strong inset display-flex row" onclick="showSurvey('${doc.id}')" data-object-id="${doc.id}">
                <div class="col-30 margin-left padding-top margin-top"><i class="f7-icons">${answered(doc.id) ? 'checkmark' : 'chart_bar_alt_fill'}</i></div>
                <div class="col-70">
                    <p>${survey.title}</p>
                    <p class="text-color-gray">${survey.body}</p>
                </div>
            </div>
          `
            });

            if (isEmpty) {
                result += `
          <div class="card-bg block block-strong inset">
            <div class="item-inner display-flex justify-content-center">There are no surveys in the database.</div>
          </div>`;
            }
            document.getElementById("surveys").innerHTML = result;
        });
    });
}

//Set the answer data on the survey page if the user has already answered the survey
function showAnswerData() {
    db.collection('answers').onSnapshot((doc) => {
        let answer = '';
        doc.docs.forEach((doc) => {
            answer = doc.data();
            if (answer.survey_id === openSurvey.id && answer.answerer === loggedInUser.email) {
                openAnswerId = doc.id;
                app.form.fillFromData('#survey-form', answer);
            }
        });
    });
}

//Submit the answer or update the users answer
function submitAnswer() {
    let answer = app.form.convertToData('#survey-form');
    answer.answerer = loggedInUser.email;
    answer.survey_id = openSurvey.id;
    if (!answered(openSurvey.id)) {
        newAnswer(answer);
    } else {
        updateAnswer(answer);
    }
}

function newAnswer(answer) {
    db.collection('answers').add(answer).then(() => {
        alertAfterSubmit();
    })
        .catch((error) => {
            alertAfterSubmit(error);
        });
}

function updateAnswer(answer) {
    db.collection('answers').doc(openAnswerId).update(answer)
        .then(() => {
            alertAfterSubmit();
        })
        .catch((error) => {
            alertAfterSubmit(error);
        });
}

function alertAfterSubmit(error) {
    if (error) {
        console.log("Error in submitting the survey:", error);
        app.dialog.alert('エラーが発生しました');
    } else {
        app.views.main.router.back();
        app.dialog.alert('回答しました');
    }
}