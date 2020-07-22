import React, { Component } from 'react';
import 'firebase/auth';
import loginBtn from '../../assets/btn_google_signin_light_normal_web.png';
import firebase from '../../Firebase';
import styles from './styles.module.scss';

class Login extends Component {
  login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        console.log({ token, user });
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;

        console.log({ errorCode, errorMessage, email, credential });
      });
  };

  render() {
    return (
      <div className={styles.loginBtnWrapper}>
        <img alt="Login" src={loginBtn} onClick={this.login} />
      </div>
    );
  }
}

export default Login;
