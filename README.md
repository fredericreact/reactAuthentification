# Authentification
![image](https://user-images.githubusercontent.com/104289891/210992869-0405393e-048c-4093-807b-d9618a0c03a7.png)

# React context

## Provide

```javascript
import React, {useState} from 'react';
 
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},
});
 
export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null)
    const userIsLoggedIn = !!token;
    const loginHandler = (token) => {
        setToken(token);
    }    
    const logoutHandler = () => {
        setToken(null);
   
    }
 
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }
 
    return (
    <AuthContext.Provider value={contextValue}>
    {props.children}
    </AuthContext.Provider>
    )
}
 
export default AuthContext

```

```javascript
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
 
import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';
 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AuthContextProvider>
);
 

```

## Use it

```javascript
import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context'
 
import classes from './AuthForm.module.css';
 
const {REACT_APP_API_URL,REACT_APP_API_TOKEN, REACT_APP_API_URLSIGNIN} =process.env
let url
 
 
const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
 
  const authCtx = useContext(AuthContext)
 
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
 
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
 
  const submitHandler = (event) => {
    event.preventDefault();
 
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
 
    // optional: Add validation
    setIsLoading(true);
    if (isLogin) {
      url = REACT_APP_API_URLSIGNIN+REACT_APP_API_TOKEN
 
    } else {
      url = REACT_APP_API_URL+REACT_APP_API_TOKEN
   
    }
 
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => {
      setIsLoading(false)
      if (res.ok) {
       return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = 'Authentification failed';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
         
          throw new Error(errorMessage);
        });
      }
    })
    .then((data) => {
      authCtx.login(data.idToken)
    })
    .catch((err) => {
      alert(err.message);
    });
  };
 
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};
 
export default AuthForm;

```

```javascript
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import classes from './MainNavigation.module.css';
import AuthContext from '../../store/auth-context';
 
const MainNavigation = () => {
  const authCtx=useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
        {!isLoggedIn && (
          <li>
            <Link to='/auth'>Login</Link>
          </li>
        )}
 
        {isLoggedIn && (
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button>Logout</button>
          </li>
        )}  
       
        </ul>
      </nav>
    </header>
  );
};
 
export default MainNavigation;
 

```
