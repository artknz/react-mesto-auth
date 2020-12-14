import React, { useState } from 'react';

const Login = ({ handleLogin }) => {
  const [ data, setData ] = useState({
    email: '',
    password: '',
    message: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData({
      ...data,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let { email, password } = data;
    handleLogin(email, password)
  }

  return(
    <div className="auth">
      <p className="auth__welcome">Вход</p>
      {/* <p className="auth__error">{data.message}</p> */}
      <form className="auth__form" onSubmit={handleSubmit}>
        <input id="username" required name="email" placeholder="Email" type="text" value={data.username} onChange={handleChange} />
        <input id="password" required name="password" placeholder="Пароль" type="password" value={data.password} onChange={handleChange} />
        <div className="auth__button-container">
          <button type="submit" className="auth__link">Войти</button>
        </div>
      </form>
    </div>
  )
}

export default Login;
