"use strict";

let app = require("./app");
let jQuery = require("jquery");
let $ = jQuery;
let permuteList = require("./permute-list");
let permutator = require("./permutator");
let ps = require("./put-selector-browserified")();
let argv = {};

const mathematical = module.exports = exports = {
    description: "Math presentation",
    current: 0,
    initialize: (defs)=>{
        app = defs.app;
        jQuery = defs.jQuery;
        $ = jQuery;
        permutator = defs.permutator;
        permuteList = defs.permuteList;
        ps = defs.ps;
        argv = app.argv;

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
        if(tmpD.length == 0) tmpD.push(1);
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

};