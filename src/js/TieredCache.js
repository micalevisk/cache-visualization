

TieredCache = function( initalCache, memoryAccessTime ) {
  this.cacheLevels = [ initalCache ];
  this.cacheTimes = [ initalCache.accessTime ];
  this.memoryAccessTime = memoryAccessTime;
}

TieredCache.prototype.addCacheLevel = function( cacheSimulator ) {
  this.cacheLevels.push( cacheSimulator );
  this.cacheTimes.push( cacheSimulator.accessTime );
}

TieredCache.prototype.removeLevel = function( level ) {
  if( typeof this.cacheLevels[level] !== "undefined" ) {
    this.cacheLevels.splice( level, 1 );
  }
}

TieredCache.prototype.clear = function() {
  for( var level in this.cacheLevels ) {
    this.clearLevel( level );
  }
}

TieredCache.prototype.clearLevel = function( level ) {
  if( typeof this.cacheLevels[level] !== "undefined" ) {
    var cacheSimulator = this.cacheLevels[level];
    this.cacheLevels[level] = new CacheSimulator( cacheSimulator.cacheSize, cacheSimulator.blockSize, cacheSimulator.setSize );
  }
}

TieredCache.prototype.resolveRequest = function( address ) {
  // If we do not have any cache levels then every request will access main memory
  if( this.cacheLevels.length == 0 ) {
    return this.memoryAccessTime;
  }

  var cacheLevel = 0,
      cacheToTest = this.cacheLevels[cacheLevel],
      accessTime = this.cacheLevels[cacheLevel++];

  while( !cacheToTest.resolveRequest( address ) ) {
    cacheToTest = this.cacheLevels[cacheLevel];

    if( typeof cacheToTest === "undefined" )  {
      // Memory access
      accessTime = this.memoryAccessTime;
      break;
    } else {
      accessTime += this.cacheTimes[cacheLevel++];
    }
  }

  return accessTime;
  
}
