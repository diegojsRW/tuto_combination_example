# Exemplo de combinação 

-------
![Languages](https://cdn4.iconfinder.com/data/icons/logos-4/24/Translate-24.png) \[[English](README.md) | **Português**\]

---------

[TOC]

## Objetivo
Este projeto foi primeiramente desenvolvido para utilização na exemplificação de combinações exclusivas no vídeo [**"Slime Rancher - Combinando Largos e programação"**](https://youtu.be/undefined). 

## Introdução teórica
Uma combinação é todo subconjunto cujos elementos são resultado de permutações entre os elementos de um conjunto de forma que não haja repetição desses elementos. Em outras palavras: a ordem dos elementos não importa.

Neste projeto, temos um conjunto de **letras do alfabeto**. 

## Como utilizar
A **quantidade de letras**, iniciando pela letra **A**, é definida pelo **parâmetro de URL** ***`n`***. 

Por padrão -- caso `n` não for informado, ou for um número inválido, `n=6`.

### Parâmetros de URL (Querystring)
|Parâmetro|Tipo|Valor padrão|Descrição
|:-------:|:--:|:----------:|---------
|n|número|6|Quantidade de letras
|p|número|2|Quantidade de ponteiros

### Atalhos de teclado
|Tecla|Função
|:---:|------
|` Enter `| Avançar próxima combinação / slide
|` Tab ` | Alternar entre avanço de combinação / slide
|` F ` | Avançar até próxima combinação válida
|` T ` | *(debug)* Exibir mensagem de teste no MathJax.

### Executando
#### Através do [Electron](https://electron.atom.io/)
```
> npm run start
```
O script `start` é um alias para dois scripts sequenciais: 
 1. `bundle`, que compila o código Javascript (Browserify); 
 2. `test`, que inicia `electron index.htm`.
#### Através de um navegador

>**Nota:** Devido ao **Controle de Acesso HTTP (CORS)**, é recomendável utilizar um servidor HTTP/HTTPS estático como o [http-server](https://www.npmjs.com/package/http-server) ou um servidor dinâmico como o Apache ou IIS. Caso necessite utilizar o protocolo `file:`, desabilite o CORS no navegador usando parâmetros de linha de comando. Por exemplo, para o Chrome: `--disable-web-security`. Pode ser necessário informar outros parâmetros. Consulte a documentação de seu navegador.

1. Compile o código Javascript:
 ```
 > npm run bundle
 ```
 * Arquivo de entrada: `./index.js`
 * Arquivo gerado: `./dist/bundle.js`

2. Abra o arquivo `index.htm` através do navegador:
 ```
 > firefox index.htm 
 ```
## Estrutura do código-fonte
### index.htm
Estrutura-base da página e arquivo de entrada.
Em uma das tags `<script>`, inicializa `MathJax.Message.div` para contornar a criação do elemento `#MathJax_Message`.

### index.less
Possui os estilos, divididos em mixins, para os elementos da página. Alguns parâmetros ajustáveis sem a necessidade de se alterar o arquivo todo são: 

* @font-size: Tamanho da fonte dos elementos da página.
* @arrow-size: Tamanho das setas indicadoras.

### index.js
Além de duas constantes que declaram o jQuery no escopo local (`const $ = require("jquery"), jQuery = $;`), possui 4 constantes de objetos principais:
#### permuteList
Contém a definição da quantidade de letras alfabéticas, bem como a inicialização de um vetor contendo tais letras. Para cada letra é criado um elemento `li` em `.letras>ul`.
 
#### permutator
Contém a criação das setas, a atualização da posição das mesmas, a lógica para permutação, bem como a lógica para encontrar combinações válidas.

#### mathematical
Contém a configuração do MathJax, a inicialização dos valores das equações em `div.mathematic`, o avanço da apresentação, bem como a chamada do `Typeset` do MathJax.

#### app
Contém a chamada para inicialização das três classes anteriores, bem como a definição do escopo global para debugging e manipulação dos eventos `$(document).ready`, `$(document).keydown` e `$(window).resize`.