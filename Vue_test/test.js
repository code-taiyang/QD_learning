
arr = [{val: 1},{val :2}]
if(arr[0].val<arr[1].val){
  [arr[0],arr[1]]=[arr[1],arr[0]]
}
console.log(arr)
