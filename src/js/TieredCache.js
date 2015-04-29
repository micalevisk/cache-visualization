// TieredCache: Controls the interface to a tiered collection of CacheSimulatory
// Arthur Wuterich
// 4/23/2015

TieredCache = function( initalCache, memoryAccessTime ) {
  this.cacheLevels = [ initalCache ];
  this.memoryAccessTime = memoryAccessTime;
}

// Pushes a cache level onto the cache stack
TieredCache.prototype.addCacheLevel = function( cacheSimulator ) {
  this.cacheLevels.push( cacheSimulator );
}

// Remove an arbitrary level from the cache stack 
TieredCache.prototype.removeLevel = function( level ) {
  if( typeof this.cacheLevels[level] !== "undefined" ) {
    this.cacheLevels.splice( level, 1 );
  }
}

// Clears and updates all CacheSimulators on the stack
TieredCache.prototype.clear = function() {
  for( var level in this.cacheLevels ) {
    this.clearLevel( level );
  }
}

// Clears and updates a single level on the cache stack
TieredCache.prototype.clearLevel = function( level ) {
  if( typeof this.cacheLevels[level] !== "undefined" ) {
    var cacheSimulator = this.cacheLevels[level];

    // Create a new cache simulator for the block using the external variables
    this.cacheLevels[level] = new CacheSimulator( cacheSimulator.external.cacheSize, cacheSimulator.external.blockSize, cacheSimulator.external.setSize, cacheSimulator.external.accessTime );
  }
}

// Resolve a memory request by querying the lowest level caches first and sequentially 
// querying the next higher level(s).
TieredCache.prototype.resolveRequest = function( address ) {

  // If we do not have any cache levels then every request will access main memory
  // else send the request to the first cache level which will handle calling the 
  // lower cache levels for the data if needed
  if( this.cacheLevels.length != 0 ) {
    this.cacheLevels[0].resolveRequest( address, this.cacheLevels.slice(1) );
  }
}
