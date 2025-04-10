function a(){
  console.log("a")
}

function instance(a) {
  return  function() {
    a()
  }
}


function getInstance(){
  return instance(a)
}


let aTest = getInstance(a)
a = 123;
aTest() // a