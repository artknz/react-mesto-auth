import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoToolTip from './InfoTooltip';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import {api} from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import * as auth from './Auth';

const App = () => {
  const[isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const[isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const[isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const[isInfoToolTipOpen, setInfoToolTipOpen] = useState(false);

  const[selectedCard, setSelectedCard] = useState(null);
  const[currentUser, setCurrentUser] = useState(CurrentUserContext);
  const[cards, setCards] = useState([]);

  const[ loggedIn, setLoggedIn ] = useState(false);
  const[ userData, setUserData ] = useState({
    email: '',
    password: '',
  });
  const[ statusResponse, setStatusResponse ] = useState()
  const history = useHistory();

  useEffect(_ => {
    tokenCheck()
  }, [])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleUpdateUser(data) {
    api.editUserInfo(data).then((data) => {
      setCurrentUser(data)
      closeAllPopups()
    });
  }

  function handleUpdateAvatar(data) {
    api.editUserAvatar(data).then((data) => {
      setCurrentUser(data)
      closeAllPopups()
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      setCards(newCards);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      const newCards = cards.filter((c) => c._id !== card._id)
      setCards(newCards);
    });
  }

  function handleAddPlaceSubmit(newCard) {
    api.addNewCard(newCard).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups()
    })
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  React.useEffect(() => {
    api.getUserInfo()
    .then(data => {
      setCurrentUser(data)
    })
  }, []);

  React.useEffect(() => {
    api.getInitialCards().then(
      (item) => {
        setCards(item);
      }
    )
  }, []);

  const handleLogin = (email, password) => {
    auth.authorize(email, password)
    .then(data => {
      localStorage.setItem('jwt', data.token)
      setUserData({
        email: data.email,
        password: data.password
      });
      setLoggedIn(true);
      history.push('/');
    })
    .catch((err) => console.log(err))
  }

  const handleRegister = (email, password) => {
    auth.register(email, password)
      .then(data => {
        setUserData({
          email: data.email,
          password: data.password
        });
        setLoggedIn(true);
        history.push('/signin');
      })
      .then(res => {
        setStatusResponse(true)
        setInfoToolTipOpen(true);
      })
      .catch(err => {
        console.log(err)
        setStatusResponse(false)
        setInfoToolTipOpen(true);
      })
  }

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      auth.getContent(jwt).then((res) => {
        if (res.data.email) {
          setUserData({
            email: res.data.email,
          });
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch(err => console.log(err))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    setUserData({
      email: ''
    });
    setLoggedIn(false)
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
      <Header
        userData={userData}
        handleLogout={handleLogout}
      />
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          loggedIn={loggedIn}
          component={Main}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={setSelectedCard}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Route path="/signup">
          <div className="registerContainer">
            <Register handleRegister={handleRegister} />
          </div>
        </Route>
        <Route path="/signin">
          <div className="loginContainer">
            <Login handleLogin={handleLogin} tokenCheck={tokenCheck} />
          </div>
        </Route>
        <Route path="/" exact>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
        </Route>
      </Switch>
      <Route path="/" exact>
        <Footer />
      </Route>

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <ImagePopup
        card={selectedCard}
        onClose={closeAllPopups}
      />

      <InfoToolTip
        isOpen={isInfoToolTipOpen}
        onClose={closeAllPopups}
        statusResponse={statusResponse}
      />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
