# SmoothScroll
```
    класс для плавного скрола к елементу, устанавливает событие на css class, 
    при клике на который ищет в нес тег 'data-smooth-scroll-id' который должен 
    содержать id елемента на странице, к которому он выполнит скролл
```

### Методы
> init
```
    активирует установку обработчика
```

> scrollTo(element: HTMLElement))
```
    принимает ссылку на HTMLElement, к которому будет произведет скролл
```


### Пример использования
```
const smoothScroll: SmoothScroll = new SmoothScroll('js-smoothScroll');
smoothScroll.init();
```
