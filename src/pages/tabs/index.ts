import Tabs from "../../scripts/modules/tabs/Tabs";
import TabsAnimationUnderline from "../../scripts/modules/tabs/extensions/TabsAnimationUnderline";

const tabsEl: HTMLElement = document.querySelector(`.js-tabsElement`);
const tabsExtensionEl: HTMLElement = document.querySelector(`.js-tabsWithExtensions`);

if (tabsEl) {
    const dynamicalTabsContainer: HTMLElement = document.querySelector(`.js-dynamicalTabs`);
    const tabs: Tabs = new Tabs(tabsEl);
    const tabsExt: Tabs = new Tabs(tabsExtensionEl, {
        extensions: [
            new TabsAnimationUnderline({
                classForDynamicElements: {
                    underline: 'c-tabs__header-underline'
                }
            })
        ]
    });

    setTimeout(()=> {
        tabs.toggleByIndex(1);
    }, 2000);

    Tabs.autoInit();

    setTimeout(()=> {
        dynamicalTabsContainer.innerHTML = `
            <div class="js-tabs c-tabs js-dynamicTabs">
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
        `;
    }, 4000);

}
