# CreateEvent
```
    добавления событий елементам
```

### Методы
> createDefault
```
    создает страндарстные события, на примере 'Click'
```

> createCustom
```
    создает кастомные события, на примере 'Open', 'Switch'
```

### Пример использования
```
cont elementEvent = new CreateEvent('open').createCustom()
element.dispatchEvent(elementEvent)
```
