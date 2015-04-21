CacheSimulator = function( cacheSize, blockSize, setSize ) {
  if( typeof cacheSize === "undefined" || 
      typeof blockSize === "undefined" ||
      typeof setSize   === "undefined"   ) {
    blockSize = 1;
    cacheSize = 10;
    setSize = 1;
  }

  this.cacheSize = cacheSize;
  this.blockSize = blockSize;
  this.setSize = setSize;
  this.blocks = {};

  // Setup cache blocks
  for( var block = 0; block < this.cacheSize; block++ ) {
    this.blocks[block] = {
      data  : [],
      lru   : 0,
      tag   : "",
      index : block
    };

    // Create all sets for block
    for( var i = 0; i < this.setSize; i++ ) {
      var dataBlock = [];

      // Setup data blocks
      for( var dataEntry = 0; dataEntry < this.blockSize; dataEntry++ ) {
        dataBlock.push( "" );
      }

      this.blocks[block].data.push( dataBlock );
    }
  }
}

CacheSimulator.prototype.resolveRequest = function( address ) {
}
