# Modal

### Разметка
```
<dialog class="js-modal">
  <div class="js-modalContainer">
    <div class="js-modalClose">
        <i>Icon close</i>
    </div>
    <div class="js-modalContent">
        //other content
    </div>
  </div>
</dialog>
```
> Сласс js-modalClose отвечает за закрытие модального окна, может присутствовать в неограниченном кол-ве
> В блове 'js-modalContent' распологается содержимое модального окна

### Необходимие стили
```
.js-modal {
    display: none;
}
```
> Не нужно задавить слити для классов с префиксом js-, необходимо создать отдельные классы, которые будут отвечать только за CSS
> Пример:
```
<dialog class="js-modal c-modal">
  <div class="js-modalContainer c-modal__container">
    <div class="js-modalClose">
        <i>Icon close</i>
    </div>
    <div class="js-modalContent c-modal__content">
        //other content
    </div>
  </div>
</dialog>
```

### Конфигурация
```
const modalDefault: Modal = new Modal(modalElementRef, {
    animationClassPrefix: 'c-modal-animate',
    animationMutableProperties: ['transform', 'opacity'],
    backdropClass: 'c-modal_backdrop',
    hasBackdrop: true,
    closable: true,
    backdropClosable: true,
    freezeScroll: true,
    hooks: {
        beforeOpen: () => void;
        open: () => void;
        beforeClose: () => void;
        close: () => void;
    }
});
```

> animationClassPrefix `string`
```
    Класс для модуля Animation
```
> animationMutableProperties `Array<string>`
```
    свойства, которые будут изменять при анимации (для оптимизации)
```
> backdropClass `string`
```
    css класс, который будет устанавливаться на блок js-modal, им уставливают задне покрытие
```
> hasBackdrop `boolean`
```
    отвечает за то, будет ли применяться пункт backdropClass
``` 
> closable `boolean`
```
    отвечает за обработку класса js-modalClose, которое отвечает за закрытие модального окна
```
> backdropClosable `boolean`
```
    отвечает за закрытие модального окна при клике на заднее покрытие
```
> freezeScroll `boolean`
```
    будет ли заморожен скролл при открытие
```
> hooks: beforeOpen `callback`
```
    callback до открытия
```
> hooks: open `callback`
```
    callback после открытия
```
> hooks: beforeClose `callback` 
```
    callback до закрытия
```
> hooks: close `callback`
```
    callback после закрытия
```

### Пример использования
```
const modalElementRef: HTMLElement = document.getElementById('js-modalDefault');
const modalDefault: Modal = new Modal(modalElementRef);
const btnShow: HTMLButtonElement = document.getElementById('js-btnShow') as HTMLButtonElement;
btnShow.addEventListener('click', () => {
    modalDefault.open();
});
```


### Анимация
> За анимацию отвечает класс Animation
> Данная анимация применятся к блоку js-modalContainer
> Пример стилей:
```
.c-modal-animate-enter,
.c-modal-animate-enter-active {
  animation: zoomInCenter 250ms ease-in-out forwards;
}

.c-modal-animate-enter-to {
}

.c-modal-animate-leave {
}

.c-modal-animate-leave-active {
  animation: zoomInCenter reverse 250ms ease-in-out forwards;
}

.c-modal-animate-leave-to {
}

@keyframes zoomInCenter {
  from {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
```

### Методы
> open
```
    открывает модальное окно, если не было отстановлено событие `open`
```
> close
```
    закрывает модальное окно, если не было отстановлено событие `close`
```
> getContent
```
    возврашает HTMLElement модального окна блока `js-modalContent`
```
> destroy
```
    удаляет события и сам елемент
```
