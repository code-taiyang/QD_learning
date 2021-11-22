var arr = [1,2,3];
var brr = [4,5]

function getArr(...arr){

    console.log('arr :>> ', arr);
}

getArr.apply(null,arr)