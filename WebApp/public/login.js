const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const loginEmail = loginForm['login-email'].value;
    const loginPassword = loginForm['login-password'].value;
    // console.log(loginEmail, loginPassword);
    auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
        console.log('login success');
        location = "users.html";
    }).catch(err => {
        const loginError = document.getElementById("loginError");
        loginError.innerText = err.message;
    });
});


const resetForm = document.getElementById('reset-form');
resetForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailAddress = resetForm['reset_email'].value;
    // console.log(loginEmail, loginPassword);
    auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
        console.log(error);
    });
});



  