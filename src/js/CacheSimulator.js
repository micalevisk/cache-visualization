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

function powOfTwo( val ) {
  var result = 0;
  result = Math.log(val)/Math.log(2);
  return result;
}


CacheSimulator = function( cacheSize, blockSize, setSize, accessTime ) {
  if( typeof cacheSize === "undefined" || 
      typeof blockSize === "undefined" ||
      typeof setSize   === "undefined"   ) {
    blockSize = 2;
    cacheSize = 8;
    setSize = 1;
  }

  if( typeof accessTime === "undefined" ) {
    accessTime = 0;
  }

  this.cacheSize = nearestPowerOfTwo( cacheSize );
  this.blockSize = nearestPowerOfTwo( blockSize );
  this.setSize = nearestPowerOfTwo( setSize );
  this.accessTime = accessTime;
  this.hits = 0;
  this.requests = 0;

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
        data  : data,
        lru   : this.setSize-(block+1),
        valid : 0
      });
    }
    this.sets.push( set );
  }

}

CacheSimulator.prototype.resolveRequest = function( address ) {
  var comps = this.getAddressComponents( address ),
      hit = false,
      hitLru = 0;

  this.requests++;

  // Check to see if the data is within the block by comparing tags from each block in the set
  for( var block in this.sets[comps.set].blocks ) {
    block = this.sets[comps.set].blocks[block];

    // Hit!
    if( block.tag == comps.tag ) {
      hit = true;
      hitLru = block.lru;
      break;
    }
  }

  if( !hit ) {
    // Insert the data into the cache at the LRU position
    this.sets[comps.set].blocks[this.sets[comps.set].lru].valid = 1;
    this.sets[comps.set].blocks[this.sets[comps.set].lru].tag = comps.tag;
    if( this.blockSize > 1 ) {
      this.fillBlock( this.sets[comps.set].blocks[this.sets[comps.set].lru].data, comps );
    } else {
      this.sets[comps.set].blocks[this.sets[comps.set].lru].data[comps.offset] = "*"+address;
    }
  }
  
  var oldBlockLru = hit?hitLru:this.sets[comps.set].blocks[this.sets[comps.set].lru].lru;

  // Set the new LRUs for the blocks
  for( var blockIndex in this.sets[comps.set].blocks ) {
    var block = this.sets[comps.set].blocks[blockIndex];

    if( block.lru < oldBlockLru ) {
      block.lru++;
    } else if( block.lru == oldBlockLru ) {
      block.lru = 0;
    }

    if( block.lru == this.setSize-1) {
      this.sets[comps.set].lru = blockIndex;
    }
  }

  if( hit ) {
    this.hits++;
  }

  return hit;
}

// Fills in the data array based on the address
CacheSimulator.prototype.fillBlock = function( dataArray, comps ) {
  var i = 0,
      entries = Math.pow( 2, comps.bitsForOffset ),
      higherOrderBits = comps.raw.substr( 0, 32-comps.bitsForOffset);
  while( i < entries ) {
    var value = higherOrderBits + padLeft( decToBin( i ), comps.bitsForOffset );
    dataArray[i] = "*"+parseInt( value, 2 );
    i++;
  }
}

CacheSimulator.prototype.getAddressComponents = function( address ) {
  var 
    binAddress = padLeft(decToBin(address),32),
    numberOfSets = this.cacheSize/this.setSize,
    bitsForSet = powOfTwo(numberOfSets),
    bitsForBlock = powOfTwo(this.blockSize),
    result = {
      tag : "",
      offset : 0,
      bitsForOffset : bitsForBlock,
      set : bitsForSet,
      bitsForSet : bitsForSet,
      raw : binAddress
    };

  // Process the number of bits for the offset within a block
  if( this.blockSize > 1 ) {
    result.offset = parseInt( binAddress.substr( binAddress.length-bitsForBlock, bitsForBlock), 2 );

    // Mutate the address to make further processing easier
    binAddress = binAddress.substr(0, binAddress.length-bitsForBlock);
  } else {
    this.offset = 0;
  }

  // Process the number of bits for the set
  if( numberOfSets > 1 ) {
    result.set = parseInt( binAddress.substr( binAddress.length-bitsForSet, bitsForSet), 2 );

    binAddress = binAddress.substr(0, binAddress.length-bitsForSet );
  } else {
    result.set = 0;
  }



  // The rest of the address becomes the tag
  result.tag = binAddress;

  return result;
}




