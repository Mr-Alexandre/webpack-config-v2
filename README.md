# Globerce website 
Webpack configuration - TypeScript, Pug, SASS, Express, Cors, Husky, Prettier

## Commands
Fast build with mode development and open project in browser:
```
$ npm run dev
```
> use watcher, available on: local ip adress 

Build project:
```
$ npm run build
```

Run server api:
```
$ npm run api
```
> run express server available on: local ip adress 

Build JS diagrams:
```
$ npm run diagrams
```
> Visualises JavaScript, TypeScript and Flow codebases as meaningful and committable architecture diagrams and saves in arkit.svg

## CSS Naming Conventions

BEM and ITCSS

BEM: Block, Element, Modifier
ITCSS: A sane, scalable, managed CSS architecture from CSS Wizardry
    
![ITCSS inverted triangle](itcss.svg)
    
- Settings – used with preprocessors and contain font, colors definitions, etc.
- Tools – globally used mixins and functions. It’s important not to output any CSS in the first 2 layers.
- Generic – reset and/or normalize styles, box-sizing definition, etc. This is the first layer which generates actual CSS.
- Elements – styling for bare HTML elements (like H1, A, etc.). These come with default styling from the browser so we can redefine them here.
- Objects – class-based selectors which define undecorated design patterns, for example media object known from OOCSS
- Components – specific UI components. This is where the majority of our work takes place and our UI components are often composed of Objects and Components
- Utilities – utilities and helper classes with ability to override anything which goes before in the triangle, eg. hide helper class
    
Example:

    .c-modal{ //block
        .c-modal__title{ //Element
        }
    }
    .c-modal_large{ //Modifier
    }
    .c-modal is-open{ //ITCSS state (is or has)
    }

