// Angular controllers
// 4/20/2015
// Arthur Wuterich

app.controller('main', function($scope) {
  // Init main controller
  $scope.addresses = "";
  $scope.repeatHandle = 0;
  $scope.repeatSpeed = 100;
  $scope.tieredCache = new TieredCache( new CacheSimulator(), 100 );

  // Adds a new cache level to the bottom of the tieredCache object
  $scope.initCache = function() {
    $scope.tieredCache.addCacheLevel( new CacheSimulator() );
  };

  // Processes the left-most address in the addresses string
  // [wrap]: If truthy then place the processed address on the end of the address string
  $scope.processAddress = function(wrap) {
    if( $scope.addresses.length && $scope.tieredCache ) {

      // Splits based on spaces and filters each element to remove non-digits
      var addresses = $scope.addresses.split(" ").map( function(ele){ return ele.replace(/\D/g,''); } );
      if( parseInt(addresses[0]) !== NaN ) {
        $scope.tieredCache.resolveRequest( addresses[0] );
      } 

      if( wrap ) {
        addresses.push( addresses.shift() );
      } else {
        addresses.shift();
      }

      $scope.addresses = addresses.join(" ");
    }

  };

  // Cache type formatting
  // Returns the type of the cache based on the configuration of the cache.
  $scope.cacheDescription = function( index ) {
    var cacheSimulator = $scope.tieredCache.cacheLevels[index],
        result = "";

    switch( cacheSimulator.cacheType() ) {
      case 0: result = cacheSimulator.setSize + "-Way Set Associative"; break;
      case 1: result = "Fully Associative"; break;
      case 2: result = "Direct Mapped"; break;
    }

    return result;
  }

  // Formatting for hit rate
  // Returns the hit rate for a given cache level formatted to 2 decimal places
  $scope.formattedHitRate = function(index) {
    var result = "0.00%",
        cacheSimulator = $scope.tieredCache.cacheLevels[index];

    if( cacheSimulator.requests != 0 ) {
      result = ((cacheSimulator.hits / cacheSimulator.requests)*100).toFixed(2)+"%";
    }

    return result;
  };

  // Formatting for block data
  // Returns the data array without quotes if there are multiple elements
  // Returns the first element if there is only one element
  $scope.renderBlockData = function( data ) {
    var result = "";

    if( data ) {
      // Single data element should not have the array braces EX: *1
      if( data.length == 1 ) {
        result = data[0];
      } else {
        // Wrap a data array with multiple elements with array braces EX: [ *1, *2 ]
        result = "[ ";
        for( var ele in data ) {
          if( ele == data.length-1 ) {
            result += data[ele]+" ]";
          } else {
            result += data[ele]+", ";
          }
        }
      }
    }

    return result;
  };

  $scope.clearCacheLevel = function( level ) {
    $scope.tieredCache.clearLevel( level );
  };

  $scope.clearCache = function() {
    $scope.tieredCache.clear();
  };

  $scope.removeCacheLevel = function( level ) {
    $scope.tieredCache.removeLevel( level );
  };

  // Click event for repeating the processAddress function
  $scope.repeatAddressSequence = function() {

    // If we have a repeat handle then clear the repeat
    if( $scope.repeatHandle != 0 ) {
      clearTimeout( $scope.repeatHandle );
      $scope.repeatHandle = 0;
    } else {
      // Setup the repeat handle for process address. We use setTimeout over setInterval to allow the 
      // interval slider to have dynamic effect
      $scope.repeatHandle = setTimeout( function() {
        // Process the address with wrapping
        $scope.processAddress(true);
        $scope.$apply();

        // Reapply the repeat handle
        $scope.repeatHandle = 0;
        $scope.repeatAddressSequence();
      }, $scope.repeatSpeed);
    }
  }

});
