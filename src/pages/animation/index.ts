import Animation, {EAnimationType} from "../../scripts/modules/animation/Animation";

const example1: HTMLElement = document.getElementById('js-example1');
if (example1) {
    const btnShow: HTMLButtonElement = document.getElementById('js-btnShow') as HTMLButtonElement;
    const btnHide: HTMLButtonElement = document.getElementById('js-btnHide') as HTMLButtonElement;

    const animationExample1: Animation = new Animation(example1, {
        classPrefix: 'example1',
        animationType: EAnimationType.animation,
    });

    btnShow.addEventListener('click', ()=> {
        animationExample1.toggleVisibility(true);
    });
    btnHide.addEventListener('click', ()=> {
        animationExample1.toggleVisibility(false);
    });
}

