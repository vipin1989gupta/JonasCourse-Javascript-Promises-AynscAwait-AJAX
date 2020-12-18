
////////////// ASYNCHRONOUS JAVASCRIPT
const second=()=>{
    setTimeout(()=>{
        console.log(`Second`);
    },2000);
}
const first=()=>{
    console.log(`First`);
    second();
    console.log(`End`);
}
first();

