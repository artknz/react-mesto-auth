import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import {api} from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';


export default function App() {
  const[isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const[isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const[isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const[selectedCard, setSelectedCard] = React.useState(null);
  const[currentUser, setCurrentUser] = React.useState(CurrentUserContext);
  const[cards, setCards] = React.useState([]);

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
      <Header />
      <Main
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={setSelectedCard}
        cards={cards}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
      />
      <Footer />

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
    </div>
    </CurrentUserContext.Provider>
  );
}
