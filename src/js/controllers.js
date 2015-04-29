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

    switch( cacheSimulator.cacheType() ) {
      case 0: result = cacheSimulator.setSize + "-Way Set Associative"; break;
      case 1: result = "Fully Associative"; break;
      case 2: result = "Direct Mapped"; break;
    }

    return result;
  }

  $scope.formattedHitRate = function(index) {
    var result = "0.00%",
        cacheSimulator = $scope.tieredCache.cacheLevels[index];

    if( cacheSimulator.requests != 0 ) {
      result = ((cacheSimulator.hits / cacheSimulator.requests)*100).toFixed(2)+"%";
    }

    return result;
  };

  $scope.renderBlockData = function( data ) {
    var result = "[ ";

    for( var ele in data ) {
      if( ele == data.length-1 ) {
        result += data[ele]+" ]";
      } else {
        result += data[ele]+", ";
      }
    }

    return result;
  };

  $scope.clearCache= function() {
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
      // Setup the repeat handle for process address
      $scope.repeatHandle = setTimeout( function() {
        $scope.processAddress(true);
        $scope.$apply();
        $scope.repeatHandle = 0;
        $scope.repeatAddressSequence();
      }, $scope.repeatSpeed);
    }
  }

});
