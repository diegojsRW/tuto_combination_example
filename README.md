# Combination example 

-------
![Languages](https://cdn4.iconfinder.com/data/icons/logos-4/24/Translate-24.png) \[[**English** | [Português](README.pt-br.md)\]

---------

[TOC]

## Goal
This project was first developed to exemplify exclusive combinations in video [**"Slime Rancher - Combining Largos and programming"**](https://youtu.be/undefined). 

## Theoretical introduction
A combination is every subset whose elements results from permutations between the elements from a set, so that there is no repetition of those elements. The order of elements doesn't matter.

In this project, we have a set of **alphabetic letters**. 

## How to use
The **quantity of letters**, starting at **A**, is defined by **URL parameter** ***`n`***. 

By default -- when `n` was not informed, or it is an invalid number, `n=6`.

### URL Parameters (Querystring)
|Parameter|Type|Default value|Description
|:-------:|:--:|:-----------:|-----------
|n|number|6|Letter count
|p|number|2|Arrow count
|z|number|100|Zoom (%)

### Keyboard Shortcuts
| Key |Function
|:---:|--------
|` Enter `| Forwards to next permutation / presentation.
|` Tab ` | Switch between forwarding of permutation / presentation.
|` F ` | Forwards until next valid combination.
|` T ` | *(debug)* Show MathJax test message.

### Running
#### Via [Electron](https://electron.atom.io/)
```
> npm run start
```
The script `start` is an alias for two sequential scripts: 
 1. `bundle`, which compiles the Javascript code (Browserify); 
 2. `test`, which starts `electron index.htm`.
#### Via a browser

>**Note:** Due **Cross-Origin Resource Sharing (CORS)**, it is recommended using an static HTTP/HTTPS server like [http-server](https://www.npmjs.com/package/http-server) or a dynamic server like Apache or IIS. If you need to use `file:`, disable CORS in the browser using command line switches. E.g.: Chrome: `--disable-web-security`. You may need to use another command line switches. Please refer to your browser documentation.

1. Compile:
 ```
 > npm run bundle
 ```
 * Input file: `./index.js`
 * Output file: `./dist/bundle.js`

2. Open `index.htm` through browser:
 ```
 > firefox index.htm 
 ```
## Source-code structure
### index.htm
Base structure of page and project's input file.
One of the tags `<script>` initializes `MathJax.Message.div` to circumvent `#MathJax_Message` creation.

### index.less
Contains styles, grouped into mixins, for the page elements. Some values are adjustable without the need of changing the whole file: 

* @font-size: Font size of page elements.
* @arrow-size: size of indicator arrows.

### main.js
Entry point of program. Calls for `app.doInit()`.

### permute-list.js
Contains definition of alphabetic letter count, as well as vector initialization holding such letters. For each letter a `li` is created on `.letras>ul`.
 
### permutator.js
Contains the creation of arrows, the updating of their positions, the permutiation logic, as well as the logic for finding valid combinations.

### mathematical.js
Contains MathJax configuration, initialization of mathematic equations on `div.mathematic`, forwarding of presentation, as well as calling to `Typeset` of MathJax.

### app.js
Contains the calling of inicialization of those three modules above, jQuery, put-selector, as well as the handling of events `$(document).ready`, `$(document).keydown` and `$(window).resize`.