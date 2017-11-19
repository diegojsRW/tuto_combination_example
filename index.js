"use strict";

const 
    jQuery = require("jquery"),
    $ = jQuery;
    // lesscss = require("./node_modules/less/dist/less.min");
/**
 * @typedef PointElm
 * @prop {number} index
 * @prop {number} numeric
 * @prop {JQuery<HTMLElement>} DOMElement
 * @prop {any} DOMContainer
 */


const permutator = {
    description: "Combinations",
    points: Array(2).fill(0).map((_,i)=>{
        return {
            index: 0, 
            numeric: i,
            DOMElement: $(`
    <div>
        <div class="arrow-container">
            <div class="arrow-subcontainer">
                <span class="arrow"></span>
                <span class="arrow-number">#${1+i}</span>
            </div>
        </div>
    </div>`),
            DOMContainer: null
        };
    }),

    /**
     * @param {PointElm} pointer 
     */
    updatePointPosition: (pointer)=>{
        let li = $(".letras>ul>li").eq(pointer.index);
        let elm = $(pointer.DOMElement).find(".arrow-container");
        // let pelm = elm.prev(".arrow-container");
        let x;
        x = (li.position().left + (li.width()/2)) - (elm.width() / 2);
        // if(pelm.get(0))
        //     x = pelm.outerWidth() + pelm.position().left;
        // else   
        //     x = li.children().last().outerWidth()
        elm.css({
            // top: `${y}px`,
            left: `${x}px`
        });
    },
    checkCombination: _=>{
        let currentCombination = permutator.points.map(pointer=>{
            return $(".letras>ul>li>.number").eq(pointer.index).text();
        });

        $(".letras>ul>li>.number").each((idx,elm)=>{
            $(elm).toggleClass("is-marked", permutator.points.filter(pointer=>pointer.index == idx).length>0)
        });

        let matches = $(".combinacoes>ul>li").filter((idx, elm)=>{
            let testCombination = elm.innerText.split("");
            currentCombination.forEach(ccChar => {
                let tcCharIdx = testCombination.indexOf(ccChar);
                if(tcCharIdx >= 0)
                    testCombination.splice(tcCharIdx, 1);
            });
            return testCombination.length == 0;
        });
        
        let duplicate = [...new Set(currentCombination)].length == 1;
        let repeated = (matches.length > 0);
        $(".arrow-container").toggleClass("is-duplicate", duplicate);
        $(".arrow-container").toggleClass("is-repeated", repeated);

        if(matches.length == 0 && !duplicate){
            $(".combinacoes>ul").append(`<li>${currentCombination.join("")}</li>`);   
            mathematical.updateSum();         
        }
        return {duplicated: duplicate, repeated: repeated, issue: duplicate||repeated};
    },
    doPermutation: (change=false, update=false)=>{
        return [...permutator.points].reduceRight((prev, currentPoint, i)=>{
            if(prev) return prev;
            let idx = currentPoint.index+1;
            prev = idx < permuteList.count;
            if(!prev) idx = 0;
            if(change) currentPoint.index = idx;
            if(update) permutator.updatePointPosition(currentPoint);
            return prev;
        }, false);
    },
    permutate: _=>{
        if(!permutator.doPermutation(true,true))
            $(".combinacoes>ul").empty();
        return permutator.checkCombination();
    },
    next: ()=>{permutator.permutate();},
    initialize: _=>{
        permutator.points.forEach(pointer=>{
            $(".letras>div").append(pointer.DOMElement);
            permutator.updatePointPosition(pointer);
        });    
        
        permutator.checkCombination();
    }
}, 
permuteList = {
    count: 6,
    initialize: _=>{
        if(app.argv.n)
            permuteList.count = parseInt(app.argv.n) || permuteList.count;
        Array(permuteList.count).fill(0).map((_,i)=>{return String.fromCharCode("A".charCodeAt() + i);}).forEach(item=>{
            $(".letras>ul").append(`<li><span class="number">${item}</span></li>`);
        });    
    }
},
mathematical = {
    description: "Math presentation",
    current: 1,
    initialize: function(){
        let sumOfAP = $("div.mathematic");
        let r = {
            first: 1,
            last: permuteList.count-1,
            step: 1,
            length: permuteList.count-1,
            answer: 0
        };
        let equationDiv = $(".sumAnswer");
        r.answer = r.length * (r.first + r.last) / 2;
        
        let t = equationDiv.text();
        
        Object.keys(r).forEach(key=>{
            /** @type { number } */
            let val = r[key];
            t = t.replace(new RegExp(key, "gi"), val.toString());
        });

        equationDiv.text(t);

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, sumOfAP.get()]);
    },
    initMathjax: _=>{
        MathJax.Hub.Config({
            jax: ["input/TeX", "output/SVG"],
            skipStartupTypeset: true,
            showMathMenu: false,
            showMathMenuMSIE: false,
            SVG: {
                scale: 190
            },
            elements: ["mathematicSection"],
            extensions: ["tex2jax.js"],
            tex2jax: {
                preview: "none"
            },
            TeX: {
                extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
            },
            styles: {
                "#MathJax_Message": {display: "block"}
            }
        });
    },
    next: _=>{

        let count = $("div.mathematic").reverse().each(/** @param {number} idx @param {HTMLElement} elm */ (idx,elm)=>{
            let nodeIdx = Array.from(elm.parentElement.children).indexOf(elm);
            $(elm).toggleClass("notRevealed", nodeIdx !== mathematical.current);
        }).length;
        mathematical.current = (mathematical.current + 1) % count;
        //MathJax.Message.Set("Todo: Implement Next for Mathematical", null, 500);
    },
    updateSum: _=>{
        let permutations = $(".combinacoes>ul>li").get().map(e=>e.innerText);
        
        let domList = $("<ul></ul>").appendTo($(".permutationsSum").empty());

        /** @type {String[]} */
        let permutationSum = Object.entries(permutations.reduce(/** @param {[]} s @param {String} p **/(s,p)=>{
            s[p.charAt(0)] = s[p.charAt(0)]+1 || 1;
            return s;
        }, {})).reduce(/** @param {[]} s @param {[string,number]} e **/(s,e)=>{
            let [g, c] = e;
            let gl = permutations.filter(p=>p[0] === g);
            
            let domListItem = $("<div></div>").appendTo($("<li></li>").appendTo(domList));
            
            $("<div></div>").appendTo(domListItem).text(c);
            
            let domGroupPermList = $("<ul></ul>").appendTo(domListItem);
            gl.forEach(perm=>{
                $("<li></li>").appendTo(domGroupPermList).text(perm);
            });
            s.push(`${c}: ${gl}`);
            return s;
        }, []);

        console.log(permutationSum);
    }

},
app = {
    skippers: [permutator, mathematical],
    skipping: 0,
    /** @type {Object<String,String>} */
    argv: {},
    /**@type { JQuery.EventHandler<HTMLElement, null>}  */
    onKeyDown: 
    /**
     * @param { JQuery.Event<HTMLElement, null> } evt
     */
    function(evt){
        
        if(evt.keyCode === 13) 
            app.skippers[app.skipping].next();

        if(evt.keyCode === 9){
            evt.preventDefault();
            app.skipping = (app.skipping + 1) % app.skippers.length
            MathJax.Message.Set(`<Enter now skips ${app.skippers[app.skipping].description}>`, null, 1000);
        
        }
        if(evt.key === "f"){ 
            let permutimer = function(){
                if(permutator.permutate().issue)
                setTimeout(permutimer, 50);
                // requestAnimationFrame(permutimer)
            };
            permutimer();
        };
        if(evt.key === "t"){
            MathJax.Message.Set("Teste", null, 10000);
        }
    },
    onResized: _=>{
        permutator.points.forEach(pointer=>permutator.updatePointPosition(pointer));
    },
    onReady: function(){
        [permuteList, permutator, mathematical].forEach(x=>x.initialize());      
        $(document).on("keydown", app.onKeyDown);
        $(window).resize(app.onResized);
        $(".letras, .combinacoes").click(permutator.next);
        $("section.mathematic").click(mathematical.next);
        mathematical.initMathjax();
    },
    doinit: function(){
        app.argv = document.location.search.slice(1).split("&").reduce((ps,p)=>{ let [k,v] = p.split("="); ps[k] = v; return ps; },{});
        //less.watch();
        jQuery.fn.reverse = [].reverse;
        
        
        window.$ = $;
        window.JQuery = $;
        window.permutator = permutator;
        window.mathematical = mathematical;
        window.permuteList = permuteList;
        $(document).ready(app.onReady);
    }
};

app.doinit();