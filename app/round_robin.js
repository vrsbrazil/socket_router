function round_robin(elements){

  if(!elements instanceof Set){
    throw new Error("element must be a Set");
  }

  var poppers;

  function recover(){

    poppers = Array.from(elements);

  }

  function get(){

    if(elements.size==0){

      throw new Error("No servers available");

    }

    var value = poppers.pop();

    if(!value){

      recover();

      return get();

    }

    return value;

  }

  this.next = function(){

    console.log(elements.size);

    return get();

  }

  this.elements = function(){

    return elements;

  }

  recover();

}

module.exports = round_robin;
