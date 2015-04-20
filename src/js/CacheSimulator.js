CacheSimulator = function( cacheSize, blockSize ) {
  if( typeof cacheSize === "undefined" || blockSize === "undefined" ) {
    blockSize = 1;
    cacheSize = 10;
  }

  this.cacheSize = cacheSize;
  this.blockSize = blockSize;
}
