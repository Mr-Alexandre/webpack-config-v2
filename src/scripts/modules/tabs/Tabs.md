# Tabs

### Разметка
```
<div class="js-tabs">
  <header class="js-tabsHeader">
    <nav class="js-tabsNav is-active">
      <button class="js-tabsTab is-active">Tab 1</button>
      <button class="js-tabsTab">Tab 2</button>
    </nav>
  </header>
  <div class="js-tabsContent">
    <div class="js-tabsItem is-active">
      <p>Content 1</p>
    </div>
    <div class="js-tabsItem">
      <p>Content Tab 2</p>
    </div>
  </div>
</div>
```

### Необходимие стили
```
.js-tabsItem {
    &:not(.is-active) {
      display: none;
    }
  }
```
> Не нужно задавить слити для классов с префиксом js-, необходимо создать отдельные классы, которые будут отвечать только за CSS
> Пример:
```
<div class="js-tabs c-tabs">
  <header class="js-tabsHeader c-tabs__header">
    <nav class="js-tabsNav is-active c-tabs__nav">
      <button class="js-tabsTab c-tabs__tab is-active">Tab 1</button>
      <button class="js-tabsTab c-tabs__tab">Tab 2</button>
    </nav>
  </header>
  <div class="js-tabsContent c-tabs__content">
    <div class="js-tabsItem c-tabs__item is-active">
      <p>Content 1</p>
    </div>
    <div class="js-tabsItem c-tabs__item">
      <p>Content Tab 2</p>
    </div>
  </div>
</div>
```

### Конфигурация
```
const tabs: Tabs = new Tabs(tabsElementRef, {
    classTabActive: string;
    classItemActive: string;
    hooks: {
        beforeToggle: (toggleInfo) => void;
        toggle: (toggleInfo) => void;
    };
    extensions?: Array<ITabsExtension>;
});
```

> classTabActive `string`
```
    Класс для активного переключателя
```
> classItemActive `string`
```
    Класс для активного елемента контента
```

> type ToggleInfo
```
type TTabsState = {
    prevTab: HTMLElement;
    tab: HTMLElement;
    item: HTMLElement;
    prevItem: HTMLElement;
    index: number;
    prevIndex: number;
}
```

> hooks: beforeToggle `callback(TTabsState)`
```
    callback до переключения
```
> hooks: toggle `callback(TTabsState)`
```
    callback после переключения
```
> hooks: create `callback(TTabsState)`
```
    callback после создания экземпляра
```
> extensions:  Array<ITabsExtension>`
```
    принимает экземпляры классов ITabsExtension
```

### Пример использования
```
    import Tabs from "tabs/Tabs";
    const tabsEl: HTMLElement = document.querySelector(`.js-tabsElement`);
    const tabs: Tabs = new Tabs(tabsEl);
```

### Методы
> autoInit(uniqueСlass?: string)
```
    активирует неактивкие табы на странице, включая те, которые былы вставлены на страницу асинхронно, 
    принимает css класс, если нужно активировать определенные табы
```
> toggleByIndex(index: number)
```
    переключает таб по индкексу, счет идет с 0, принимает индекс таба на который нужно переключить
```
> destroy
```
    удаляет события и сам елемент
```
