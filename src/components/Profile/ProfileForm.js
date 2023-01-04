import {useRef, useContext} from 'react'
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const {REACT_APP_API_TOKEN, REACT_APP_API_URLCHANGEPASSWORD} =process.env 

const ProfileForm = () => {
  
  const url = REACT_APP_API_URLCHANGEPASSWORD+REACT_APP_API_TOKEN
  console.log(url)
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext)

  const submitHandler = event => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value

    fetch(url,
      {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type':'application/json'
      }
    }).then(res=>{

    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
