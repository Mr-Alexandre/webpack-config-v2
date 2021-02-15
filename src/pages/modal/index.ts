import Modal from "../../scripts/modules/modal/Modal";
import ModalConfirm from "../../scripts/modules/modal/ModalConfirm";
import ModalCreate from "../../scripts/modules/modal/ModalCreate";

const modalElementRef: HTMLElement = document.getElementById('js-modalDefault');
const modalConfirmElementRef: HTMLElement = document.getElementById('js-modalConfirm');
if (modalElementRef) {
    //Default
    const modalDefault: Modal = new Modal(modalElementRef);
    const btnShow: HTMLButtonElement = document.getElementById('js-btnShow') as HTMLButtonElement;
    btnShow.addEventListener('click', () => {
        modalDefault.open();
    });
    console.log(modalDefault);

    //Confirm
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
    const btnShowConfirm: HTMLButtonElement = document.getElementById('js-btnShowConfirm') as HTMLButtonElement;
    btnShowConfirm.addEventListener('click', () => {
        modalConfirm.open();
    });

    //create
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
}
