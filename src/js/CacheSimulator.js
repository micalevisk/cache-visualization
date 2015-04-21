function nearestPowerOfTwo( val ) {
  var result = 0;
  
  result = Math.pow(2,Math.round(Math.log(parseInt(val))/Math.log(2)));

  return result;
}

function decToBin(dec) {
    return (dec >>> 0).toString(2);
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

CacheSimulator = function( cacheSize, blockSize, setSize ) {
  if( typeof cacheSize === "undefined" || 
      typeof blockSize === "undefined" ||
      typeof setSize   === "undefined"   ) {
    blockSize = 1;
    cacheSize = 8;
    setSize = 1;
  }

  this.cacheSize = nearestPowerOfTwo( cacheSize );
  this.blockSize = nearestPowerOfTwo( blockSize );
  this.setSize = nearestPowerOfTwo( setSize );

  // Clamp the setSize to be within the maximum blocksize
  if( this.setSize > this.cacheSize) {
    this.setSize = this.cacheSize;
  }
  this.sets = []

  // Add the correct number of sets to the cache
  for( var setIndex = 0; setIndex < (this.cacheSize/this.setSize); setIndex++ ) {
    var set = {
      index  : setIndex,
      lru    : 0,
      blocks : [],
    }

    for( var block = 0; block < this.setSize; block++ ) {
      var data = [];
      for( var i = 0; i < this.blockSize; i++ ) {
        data.push("-");
      }

      set.blocks.push( {
        index : block,
        tag   : "",
        data  : data
      });
    }
    this.sets.push( set );
  }

}

CacheSimulator.prototype.resolveRequest = function( address ) {
  var bin = padLeft(decToBin(address),32);
  console.log( address, bin );
  // Find the correct set
  // Find the correct block
  // Check to see if the data is within the block by comparing tags from each block in the set
  // Fill in the correcy data block
  // Fill in the rest of the data-block if blocksize>1
  // Update LRU for the entire set
}




