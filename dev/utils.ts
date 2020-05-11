// For timeout in async function
function wait(time : number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

// Turn viewport width string into number
function vwToNum(vw : string) : number {
    return parseFloat(vw.slice(0, vw.length - 2))
}

function toGrid(num : number) {
    return Math.round(num / pixelWidth) * pixelWidth;
}