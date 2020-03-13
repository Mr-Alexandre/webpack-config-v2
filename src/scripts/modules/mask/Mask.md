# Mask
```
    Дабавляет маску ввода, используя библиотеку imask
```

### Методы
> init
```
    запускает поиск и активацию масок на странице, так же 
    активирует елемента добавленные в DOM асинхронно
```

### Конфигурация формата фасок
```
const maskFormats: MaskFormats = {
    phone: {
        placeholder: '+7 (xxx) xxx-xx-xx',
        class: 'js-maskPhone',
        option: {
            mask: '{+7} (000) 000-00-00',
            lazy: true,
            placeholderChar: 'x',
        },
    },
}
```

### Пример использования
```
import Mask, {maskFormats} from "./mask/Mask";
new Mask(maskFormats).init();
```
