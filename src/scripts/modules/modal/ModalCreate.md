# Modal Create

> Примечание
```
Создает модальное окно программным способом
```

### Пример использования
> создание Modal Default
```
const btnCreate: HTMLButtonElement = document.getElementById('js-btnCreateModalDefault') as HTMLButtonElement;
const btnCreateConfirm: HTMLButtonElement = document.getElementById('js-btnCreateModalConfirm') as HTMLButtonElement;
btnCreate.addEventListener('click', () => {
    const modal: Modal = new ModalCreate()
        .createDefault({
            hooks: {
                close: () => {
                    modal.destroy();
                }
            }
        });
    modal.open();
});
```

> создание Modal Confirm
```
btnCreateConfirm.addEventListener('click', () => {
const modal: ModalConfirm = new ModalCreate({template: modalConfirmElementRef})
    .createConfirm({
        hooks: {
            close: () => {
                modal.destroy();
            }
        },
        onAccept: (btn) => {
            modal.close();
        },
        onReject: (btn) => {
            modal.close();
        },
    });
modal.open();
});
```
