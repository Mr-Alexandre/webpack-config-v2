# Modal Сonfirm

### Разметка
```
<dialog class="js-modal">
  <div class="js-modalContainer">
    <div class="js-modalContent">
        <button class="js-modalBtnAccept">Accept</button>
        <button class="js-modalBtnReject">Reject</button>
    </div>
  </div>
</dialog>
```

> Примечание 
```
опции closable и backdropClosable по умолчанию false
```

### Конфигурация
```
const modalConfirm: ModalConfirm = new ModalConfirm(modalConfirmElementRef, {
    ...Modal
    onAccept: (btn) => {
        modalConfirm.close();
        console.log('Accept');
    },
    onReject: (btn) => {
        modalConfirm.close();
        console.log('Reject');
    },
});
```

### Пример использования
```
const btnShowConfirm: HTMLButtonElement = document.getElementById('js-btnShowConfirm') as HTMLButtonElement;
const modalConfirm: ModalConfirm = new ModalConfirm(modalConfirmElementRef, {
    onAccept: (btn) => {
        modalConfirm.close();
        console.log('Accept');
    },
    onReject: (btn) => {
        modalConfirm.close();
        console.log('Reject');
    },
});
btnShowConfirm.addEventListener('click', () => {
    modalConfirm.open();
});
```
