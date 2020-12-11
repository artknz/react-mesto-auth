import React, { useState } from 'react';

const Login = () => {
  const [ data, setData ] = useState({
    username: '',
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
    let { username, password } = data;
    console.log(username, password)
  }

  return(
    <div onSubmit={handleSubmit} className="auth">
      <p className="auth__welcome">Вход</p>
      {/* <p className="auth__error">{data.message}</p> */}
      <form className="auth__form">
        <input id="username" required name="username" placeholder="Email" type="text" value={data.username} onChange={handleChange} />
        <input id="password" required name="password" placeholder="Пароль" type="password" value={data.password} onChange={handleChange} />
        <div className="auth__button-container">
          <button type="submit" className="auth__link">Войти</button>
        </div>
      </form>
    </div>
  )
}

export default Login;
