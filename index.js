"use strict";

const 
    jQuery = require("jquery"),
    $ = jQuery;
    // lesscss = require("./node_modules/less/dist/less.min");

/** @type {(...args: any)=>HTMLElement} */
const
    ps = require("./put-selector-browserified")();

/**
 * @typedef PointElm
 * @prop {number} index
 * @prop {number} numeric
 * @prop {JQuery<HTMLElement>} DOMElement
 * @prop {any} DOMContainer
 */


const permutator = {
    description: "Combinations",
    count: 2,
    /** @type {PointElm[]} */
    points: null,

    /**
     * @param {PointElm} pointer 
     */
    updatePointPosition: (pointer)=>{
        let li = $(".letras>ul>li").eq(pointer.index);
        let elm = $(pointer.DOMElement).find(".arrow-container");
        let x = (li.position().left + (li.width()/2)) - (elm.width() / 2);
        elm.css({
            left: `${x}px`
        });
    },
    updatePoints: _=>{
        permutator.points.forEach(pointer=>permutator.updatePointPosition(pointer));
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
        
        let duplicate = [...new Set(currentCombination)].length < currentCombination.length;
        let repeated = (matches.length > 0);
        $(".arrow-container").toggleClass("is-duplicate", duplicate); //E.g.: AA, BB, CC, AAB
        $(".arrow-container").toggleClass("is-repeated", repeated);   //already exists on list, e.g.: BA and AB

        if(matches.length == 0 && !duplicate){
            // $(".combinacoes>ul").append(`<li>${currentCombination.join("")}</li>`);   
            ps($(".combinacoes>ul")[0], "li", currentCombination.join(""));   
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
    permutate: (change=true,update=true)=>{
        if(!permutator.doPermutation(change,update))
            $(".combinacoes>ul").empty();
        return permutator.checkCombination();
    },
    next: ()=>{permutator.permutate();},
    initialize: _=>{
        if(app.argv.p) {
            app.argv.p = Math.max(parseInt(app.argv.p),1);
            permutator.count = app.argv.p || permutator.count;
        }

        permutator.points = Array(permutator.count).fill(0).map((_,i)=>{
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
        });


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
        if(app.argv.n){
            app.argv.n = Math.max(parseInt(app.argv.n), 2);
            permuteList.count = app.argv.n || permuteList.count;
        }

        Array(permuteList.count).fill(0).map((_,i)=>{return String.fromCharCode("A".charCodeAt() + i);}).forEach(item=>{
            // $(".letras>ul").append(`<li><span class="number">${item}</span></li>`);
            ps($(".letras>ul")[0], "li>span.number", item);
        });    
    }
},
mathematical = {
    description: "Math presentation",
    current: 0,
    initialize: function(){
        let mathSection = $("div.mathematic:first").parent()[0];
        
        ps(mathSection, "div.mathematic", `\\[\\prod_{i=1}^{p} {{n-i+1} \\over i}\\]`);
        
        let mathvars = {p: permutator.count, n: permuteList.count};
        let tmpN = [], tmpD = []; 
        Array(mathvars.p).fill(0).map((_,_i)=>{
            let i = _i+1;
            let frn = mathvars.n - i + 1;
            let frd = i; 
            if(frn != 1) tmpN.push(frn);
            if(frd != 1) tmpD.push(i);
        });
        let resolveMathvars = expr=>{
            Object.keys(mathvars).forEach(v=>{
                expr = expr.replace(new RegExp("\\$" + v,"gi"), mathvars[v]);
            });
            return expr;
        };
        ps(mathSection, "div.mathematic", resolveMathvars(`\\[\\prod_{i=1}^{$p} {{$n-i+1} \\over i}\\]`));
    
        ps(mathSection, "div.mathematic", `\\[{{${tmpN.join(" \\times ")}} \\over {${tmpD.join(" \\times ")}}}\\]`);
        ps(mathSection, "div.mathematic", `\\[  ({ {n!} \\over {(n-p)!} }) \\over {p!}     \\]`);
        ps(mathSection, "div.mathematic", `\\[  {n!} \\over {(n-p)! \\times p!}     \\]`);
        ps(mathSection, "div.mathematic", resolveMathvars(`\\[  {$n!} \\over {($n-$p)! \\times $p!}     \\]`));
        mathvars._n_p = mathvars.n - mathvars.p;
        ps(mathSection, "div.mathematic", resolveMathvars(`\\[  {$n!} \\over {$_n_p! \\times $p!}     \\]`));

        ps(mathSection, "div.mathematic", `\\[{{${tmpN.join(" \\times ")}} \\over {${tmpD.join(" \\times ")}}}\\]`);
        tmpD = tmpD.filter(i => {
            let ik = tmpN.indexOf(i);
            if(ik >= 0)
                tmpN.splice(ik, 1);
            return ik < 0;
        });
        ps(mathSection, "div.mathematic", `\\[{{${tmpN.join(" \\times ")}} \\over {${tmpD.join(" \\times ")}}}\\]`);
        mathvars._nm1 = mathvars.n - 1;
        ps(mathSection, "div.mathematic", resolveMathvars(`\\[ {$_nm1 ($_nm1 + 1)} \\over 2 \\]`));
        ps(mathSection, "div.mathematic", `\\[\\sum{AP(First,Last,[Step=1])} = {{Length(AP) \\times (First + Last)} \\over {2}}\\]`);
        ps(mathSection, "div.mathematic", resolveMathvars(`\\[\\sum{AP(1,$_nm1,1)} = {{$_nm1 \\times (1 + $_nm1)}\\over{2}}\\]`));
        mathematical.next(); 



        mathematical.current = 1;
        // $("section.mathematic");

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathSection]);
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
        
        // let domList = $("<ul></ul>").appendTo($(".permutationsSum").empty());
        let domList = ps($(".permutationsSum").empty()[0], "ul");

        /** @type {String[]} */
        let permutationSum = Object.entries(permutations.reduce(/** @param {[]} s @param {String} p **/(s,p)=>{
            s[p.charAt(0)] = s[p.charAt(0)]+1 || 1;
            return s;
        }, {})).reduce(/** @param {[]} s @param {[string,number]} e **/(s,e)=>{
            let [g, c] = e;
            let gl = permutations.filter(p=>p[0] === g);
            
            let domListItem = ps(domList, "li", "", "div");
        
            ps(domListItem, "div", c);

            let domGroupPermList = ps(domListItem, "ul");
            
            gl.forEach(perm=>{
                ps(domGroupPermList, "li", perm);
            });
            s.push([c, gl]);
            return s;
        }, []);
        ps(domList, "li", "", "div", "", "div", permutationSum.reduce((s,p)=>s+p[0], 0));
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
        if(evt.key.toLowerCase() === "f"){ 
            let permutimer = function(){
                let it = 0;
                while(permutator.permutate(true,false).issue)
                    if(it++ > 1000) 
                        return console.warn("Giving up...");
                // if(permutator.permutate(true,false).issue)
                // requestAnimationFrame(permutimer)
                // setTimeout(permutimer, 50);
                
                permutator.updatePoints();
            };
            permutimer();
        };
        if(evt.key === "t"){
            MathJax.Message.Set("Teste", null, 10000);
        }
    },
    onResized: _=>{
        permutator.updatePoints();//.forEach(pointer=>permutator.updatePointPosition(pointer));
    },
    onReady: function(){
        if(app.argv.z)
            less.modifyVars({
                "@font-size": (2.2 * (app.argv.z / 100)).toFixed(2) + "vw" 
            });

        [permuteList, permutator, mathematical].forEach(x=>x.initialize());      
        $(document).on("keydown", app.onKeyDown);
        $(window).resize(app.onResized);
        $(".letras, .combinacoes").click(permutator.next);
        $("section.mathematic").click(mathematical.next);

        mathematical.initMathjax();
    },
    doinit: function(){
        app.argv = document.location.search.slice(1).split("&").reduce((ps,p)=>{ let [k,v] = p.split("="); ps[k] = v; return ps; },{});
        
        jQuery.fn.reverse = [].reverse;
        
        window.$ = $;
        window.JQuery = $;
        window.ps = ps;
        window.permutator = permutator;
        window.mathematical = mathematical;
        window.permuteList = permuteList;
        $(document).ready(app.onReady);
    }
};

app.doinit();