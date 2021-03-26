function f(x){
    return 1/x;
}

const plotRes = 1000;
let wasDrawn = false;


function update(){
    let numRects = +document.getElementById('num-rects').value;
    if (numRects < 1){
        numRects = 1;
    }else if(numRects > 100){
        numRects = 100;
    }
    numRects = Math.round(numRects);
    document.getElementById('num-rects').value = numRects;
    let shape = document.getElementById('shape').value;

    let data = {
        x: [],
        y: [],
        type: 'scatter'
    }
    let l = 1;
    let r = 2;
    for(let i = 0; i <= plotRes; i++){
        let x = (r-l)*i/plotRes + l;
        data.x.push(x);
        data.y.push(f(x));
    }

    let shapes = [];
    let table = document.getElementById('res-table');
    table.innerHTML = "";
    if(shape === 'rect'){
        table.innerHTML += `<tr><th>N</th><th>x0</th><th>Δx</th><th>f(x0)</th><th>S</th></tr>`;
    }else {
        table.innerHTML += `<tr><th>N</th><th>x0</th><th>x1</th><th>f(x0)</th><th>f(x1)</th><th>S</th></tr>`;
    }
    let answer = 0;
    let line = {width: 1};
    for(let i = 0; i < numRects; i++){
        let xl = (r-l)*i/numRects + l;
        let xr = (r-l)*(i+1)/numRects + l;
        shapes.push({type: 'line', x0: xl, y0: 0, x1: xl, y1: f(xl), line});
        shapes.push({type: 'line', x0: xl, y0: 0, x1: xr, y1: 0, line});
        if(shape === 'rect'){
            let S = (xr-xl)*f(xl);
            answer += S;
            table.innerHTML += `<tr><td>${i+1}</td><td>${xl.toFixed(3)}</td><td>${(xr-xl).toFixed(3)}</td><td>${f(xl).toFixed(3)}</td><td>${S.toFixed(3)}</td></tr>`;
            shapes.push({type: 'line', x0: xr, y0: 0, x1: xr, y1: f(xl), line});
            shapes.push({type: 'line', x0: xl, y0: f(xl), x1: xr, y1: f(xl), line});
        }else {
            let S = (f(xl) + f(xr))* (xr-xl) / 2;
            table.innerHTML += `<tr><td>${i+1}</td><td>${xl.toFixed(3)}</td><td>${xr.toFixed(3)}</td><td>${f(xl).toFixed(3)}</td><td>${f(xr).toFixed(3)}</td><td>${S.toFixed(3)}</td></tr>`;
            answer += S;
            shapes.push({type: 'line', x0: xr, y0: 0, x1: xr, y1: f(xr), line});
            shapes.push({type: 'line', x0: xl, y0: f(xl), x1: xr, y1: f(xr), line});
        }

    }
    let layout = {
        xaxis: {title: 'X', range: [l - 0.1, r + 0.2]},
        yaxis: {title: 'Y', range: [-0.1, 1.1]},
        shapes,
        // width: window.innerWidth * 0.9,
        // height: window.innerHeight / 3 * 2,
        autosize: true,
        margin: {l: 70, r: 0, t:0, b:70}

    };
    if(wasDrawn){
        Plotly.react('plot', [data], layout);
    }else {
        wasDrawn = true;
        Plotly.newPlot('plot', [data],layout );
    }

    let outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    let tex = `{\\int_${l}^${r} {1 \\over x}} \\approx ${answer.toFixed(10)}`;
    MathJax.texReset();
    let options = MathJax.getMetricsFor(outputDiv);
    MathJax.tex2chtmlPromise(tex, options).then(function (node) {

        outputDiv.appendChild(node);
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();


    });
}

window.onresize = function (){
    Plotly.relayout('plot', {})
}

update();