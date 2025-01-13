import icons from '/public/img/icons.svg';

class NotificationView {
  _parentElement = document.querySelector('.notifications-container');
  _defaultRemoveTime = 3; //seconds

  render(message, type = 'notification', duration = this._defaultRemoveTime) {
    type =
      (type?.toLocaleLowerCase() === 'success') |
      (type?.toLocaleLowerCase() === 'error') |
      (type?.toLocaleLowerCase() === 'warning')
        ? type
        : 'notification';

    const finalDuration = duration > 0 ? duration : this._defaultRemoveTime;
    const notificationElement = this._generateElement(message, type);

    this._parentElement.insertAdjacentElement('beforeend', notificationElement);

    this._parentElement.classList.remove('hidden');

    this._setAutoRemove(notificationElement, finalDuration);
  }

  _generateMarkup(message, type) {
    const icon = `${icons}#icon-${type}`;
    return `
      <div class="notification notification--${type}">
        <svg class="notification__icon">
            <use href="${icon}"></use>
        </svg>
        <p class="notification__message">${message}</p>
      </div>`;
  }

  _generateElement(message, type) {
    const markup = this._generateMarkup(message, type);
    return document.createRange().createContextualFragment(markup).children[0];
  }

  _setAutoRemove(notificationElement, duration) {
    setTimeout(() => {
      this._closeNotification(notificationElement);
    }, duration * 1000);
  }

  _closeNotification(notificationElement) {
    const onAnimationEnd = function () {
      notificationElement.remove();
      notificationElement.removeEventListener('animationend', onAnimationEnd);
      if (this._parentElement.childElementCount === 0) {
        this._parentElement.classList.add('hidden');
      }
    }.bind(this);

    notificationElement.addEventListener('animationend', onAnimationEnd);
    notificationElement.style.animation = 'fadeOut 0.3s ease-out';
  }
}

export default new NotificationView();
