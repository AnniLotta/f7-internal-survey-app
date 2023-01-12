# Internal survey app using Framework7 and Firebase

A post about creating the application [here](https://medium.com/the-web-tub/creating-a-survey-application-using-monaca-2c8ecca62ab8).

## Installation

Clone the project and install it with these commands:

```
git clone https://github.com/monaca-samples/f7-internal-survey-app.git
cd f7-internal-survey-app
npm install
```
### Firebase

Install Firebase with this command:
```
npm install --save firebase
```

After the installation, login or make an account to [Firebase](https://firebase.google.com). In the Firebase console, create a new project and register the app to the project. Copy the Firebase configuration code that you get to the `config.js`-file:

```
  var firebaseConfig = {
    apiKey: "YOUR_OWN_APIKEY_HERE",
    authDomain: "YOUR_OWN_AUTHDOMAIN_HERE",
    projectId: "YOUR_OWN_PROJECTID_HERE",
    storageBucket: "YOUR_OWN_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_OWN_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_OWN_APPID_HERE",
    measurementId: "YOUR_OWN_MEASUREMENTID_HERE"
  };
  
```

In the 'Rules'-section of the database view in Firebase console, make sure that you're allowed to both read and write to the database:

![1*DxgWVVriMJz5S9J42jvrww](https://user-images.githubusercontent.com/77331409/120962141-1e2ba580-c79a-11eb-821f-4a15e20843fa.png)


To set up the user login and registration, enable the 'Email/Password' option on the 'Authentication' page of the Firebase console:

![1*o2jFEG0cnnIY9wCGT9l1Gg](https://user-images.githubusercontent.com/77331409/120962208-3e5b6480-c79a-11eb-908f-ec43f2d79320.png)

The application needs three collections: admins, answers and surveys. Surveys are added to the application by creating a new survey document in the surveys collection and giving it the necessary information. The most important field is the 'page' field that is the path to the survey's HTML-document in the source code. Admins can be added manually by saving their email to the 'admins'-collection. Answers are stored automatically when an answer to a survey is submitted.

![1*DqMqDqtWh00cHhka3kx39g](https://user-images.githubusercontent.com/77331409/120962583-fb4dc100-c79a-11eb-8e72-6fb435130476.png)


## Usage

Run the application with

```
npm run dev
```

