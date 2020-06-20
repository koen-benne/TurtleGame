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

function preloadImages(list : string[]) {
    const imageList = [];
    for (let i = 0; i < list.length; i++) {
        const img = new Image();
        img.src = list[i];
    }
}