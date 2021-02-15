# FreezingScroll
```
    Singleton class для заморозки скрола на странице, считает кол-во вывозов 
    заморозки, и при разморозки нужно произвести столько же вызовов
```

### Методы
> freeze
```
    замараживает скролл, увелияивая счетчик замарочки на +1б
```

> unfreeze
```
    размораживает скролл, увелияивая счетчик замарочки на +1, если 
    счетчик >0 то разморозки не будет 
```


### Пример использования
```
const freezingScroll: FreezingScroll = new FreezingScroll();
freezingScroll.freeze();
setTimeout(() => {
    freezingScroll.unfreeze();
}, 1000)
```
