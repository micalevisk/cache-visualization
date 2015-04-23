// TieredCache: Controls the interface to a tiered collection of CacheSimulatory
// Arthur Wuterich
// 4/23/2015

TieredCache = function( initalCache, memoryAccessTime ) {
  this.cacheLevels = [ initalCache ];
  this.cacheTimes = [ initalCache.accessTime ];
  this.memoryAccessTime = memoryAccessTime;
}

// Pushes a cache level onto the cache stack
TieredCache.prototype.addCacheLevel = function( cacheSimulator ) {
  this.cacheLevels.push( cacheSimulator );
  this.cacheTimes.push( cacheSimulator.accessTime );
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
    this.cacheLevels[level] = new CacheSimulator( cacheSimulator.cacheSize, cacheSimulator.blockSize, cacheSimulator.setSize, cacheSimulator.accessTime );
  }
}

// Resolve a memory request by querying the lowest level caches first and sequentially 
// querying the next higher level(s).
TieredCache.prototype.resolveRequest = function( address ) {
  // If we do not have any cache levels then every request will access main memory
  if( this.cacheLevels.length == 0 ) {
    return this.memoryAccessTime;
  }

  var cacheLevel = 0,
      cacheToTest = this.cacheLevels[cacheLevel],
      accessTime = this.cacheLevels[cacheLevel++];

  // Test each cache level
  while( !cacheToTest.resolveRequest( address ) ) {
    // Pull the next cache to test
    cacheToTest = this.cacheLevels[cacheLevel];

    // If true we have went through all caches => Main Memory access
    if( typeof cacheToTest === "undefined" )  {
      // Memory access
      accessTime += this.memoryAccessTime;
      break;
    } else {
      accessTime += this.cacheTimes[cacheLevel++];
    }
  }

  return accessTime;
  
}
