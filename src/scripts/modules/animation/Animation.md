# Animation

## Примечание
>Схема работы (как в VueJS and Angular)

### Классы переходов
>Есть шесть классов, применяющихся в анимациях появления и исчезновения элементов:

```
-enter: Означает начало анимации появления элемента. Этот класс добавляется перед вставкой элемента, 
    а удаляется в следующем фрейме после вставки.
```
```
-enter-active: Означает, что анимация появления элемента активна. Этот класс остаётся в течение всей 
    анимации. Он добавляется перед вставкой элемента, а удаляется как только переход или анимация прекратились.
    Используйте его для установки длительности, задержки и плавности (easing curve) анимации появления.
```
```
-enter-to: Означает, что анимация появления элемента завершается. Класс добавляется в следующем фрейме после вставки элемента
    (тогда же, когда будет удалён -enter ), удаляется после завершения перехода или анимации.
```
```
-leave: Означает начало анимации исчезновения элемента. Класс добавляется как только началась анимация исчезновения, 
    а удаляется в следующем фрейме после этого.
```
```
-leave-active: Означает, что анимация исчезновения элемента активна. Этот класс остаётся в течение всей анимации. Он добавляется как только начинается анимация
    исчезновения, а удаляется как только переход или анимация прекратились. Используйте его для установки длительности, задержки и плавности (easing curve) анимации исчезновения.
```
```
-leave-to: Означает, что анимация исчезновения элемента завершается. Класс добавляется в следующем фрейме после начала анимации
    исчезновения (тогда же, когда будет удалён -leave), а удаляется после завершения перехода или анимации.
```

### Пример
```
.prefix-enter{
    opacity: 0;
}
.prefix-enter-active{
    transition: opacity .5s;
}
.prefix-enter-to{
}

.prefix-leave-active{
    transition: opacity .5s;
}
.prefix-leave-to{
    opacity: 0;
}
.prefix-leave{
}
```

### Пример с CSS @keyframes
```
.prefix-enter, .prefix-enter-active{
    animation: niceIn 0.5s linear;
}
.prefix-leave-active{
    animation: niceOut reverse 0.5s linear;  !!!reverse указывайте в том случае, если у вас один @keyframes, и вы хотите что-бы он сделал то же но на оборот
}
```


### Пример использования
```
import Animation, {EAnimationType} from "Animation";

const block: HTMLElement = document.getElementById('js-block');
const btnShow: HTMLButtonElement = document.getElementById('js-btnShow') as HTMLButtonElement;
const btnHide: HTMLButtonElement = document.getElementById('js-btnHide') as HTMLButtonElement;

const animation: Animation = new Animation(block, {
    classPrefix: 'block',
    animationType: EAnimationType.animation,
});

btnShow.addEventListener('click', ()=> {
    animation.toggleVisibility(true);
});
btnHide.addEventListener('click', ()=> {
    animation.toggleVisibility(false);
});

``````CSS``````
.block {
  width: 200px;
  height: 100px;
  background-color: blueviolet;
  margin: 10px 0;
}
.example1-enter-active {
  animation: bounce-in .5s;
}
.example1-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```
