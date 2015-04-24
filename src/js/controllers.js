// Angular controllers
// 4/20/2015
// Arthur Wuterich

app.controller('main', function($scope) {
  // Init main controller
  $scope.cacheSize = 8;
  $scope.blockSize = 4;
  $scope.setSize   = 2;
  $scope.addresses = "";
  $scope.repeatHandle = 0;
  $scope.repeatSpeed = 100;
  $scope.tieredCache = new TieredCache( new CacheSimulator(), 100 );

  // Event handlers
  $scope.initCache = function() {
    $scope.tieredCache.addCacheLevel( new CacheSimulator() );
  };

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

  $scope.clearCacheLevel = function( level ) {
    $scope.tieredCache.clearLevel( level );
  };

  $scope.cacheDescription = function( index ) {
    var cacheSimulator = $scope.tieredCache.cacheLevels[index],
        result = "";

    // Edge case when we only have a single block
    if( cacheSimulator.setSize == cacheSimulator.cacheSize && cacheSimulator.cacheSize == cacheSimulator.blockSize && cacheSimulator.setSize == 1 ) {
      result = "Direct Mapped";

    // When we have a set size of the cache size this is fully associative
    } else if( cacheSimulator.setSize == cacheSimulator.cacheSize ) {
      result = "Fully Associative";

    // If the setSize is not 1 and not equal to the cache size then we are n-way set accociative
    } else if( cacheSimulator.setSize != 1 ) {
      result = cacheSimulator.setSize + "-Way Set Associative";

    // If our setSize is 1 then we are direct mapped
    } else {
      result = "Direct Mapped";
    }

    return result;
  }

  $scope.clearCache= function() {
    $scope.tieredCache.clear();
  };

  $scope.removeCacheLevel = function( level ) {
    $scope.tieredCache.removeLevel( level );
  };

  $scope.repeatAddressSequence = function() {
    if( $scope.repeatHandle != 0 ) {
      clearTimeout( $scope.repeatHandle );
      $scope.repeatHandle = 0;
    } else {
      $scope.repeatHandle = setTimeout( function() {
        $scope.processAddress(true);
        $scope.$apply();
        $scope.repeatHandle = 0;
        $scope.repeatAddressSequence();
      }, $scope.repeatSpeed);
    }
  }

});
