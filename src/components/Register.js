import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
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
    if (data.password  === data.confirmPassword){
      let { username, password, email } = data;
    }
  }
  return(
    <div onSubmit={handleSubmit} className="auth">
      <p className="auth__welcome">Регистрация</p>
      {/* <p className="auth__error">{data.message}</p> */}
      <form className="auth__form">
        <input id="username" required name="username" placeholder="Email" type="text" value={data.username} onChange={handleChange} />
        <input id="password" required name="password" placeholder="Пароль" type="password" value={data.password} onChange={handleChange} />
        <div className="auth__button-container">
          <button type="submit" className="auth__link">Зарегистрироваться</button>
        </div>
        <p className="auth__register-router">Уже зарегистрированы?<Link to="/signin" className="auth__register-router"> Войти</Link></p>
      </form>
    </div>
  );
}

export default Register;
