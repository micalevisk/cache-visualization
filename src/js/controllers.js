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
  $scope.tieredCache = new TieredCache( new CacheSimulator(), 100 );

  // Event handlers
  $scope.initCache = function() {
    $scope.tieredCache.addCacheLevel( new CacheSimulator() );
  };

  $scope.processAddress = function(wrap) {
    if( $scope.addresses.length && $scope.tieredCache ) {
      var addresses = $scope.addresses.split( " " );
      if( parseInt(addresses[0]) !== NaN ) {
        console.log( "Process the provided address: ", addresses[0] );
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

  $scope.clearCache= function() {
    $scope.tieredCache.clear();
  };

  $scope.removeCacheLevel = function( level ) {
    $scope.tieredCache.removeLevel( level );
  };

  $scope.repeatAddressSequence = function() {
    if( $scope.repeatHandle != 0 ) {
      clearInterval( $scope.repeatHandle );
      $scope.repeatHandle = 0;
    } else {
      $scope.repeatHandle = setInterval( function() {
        $scope.processAddress(true);
        $scope.$apply();
      }, 100 );
    }
  }

  $scope.randomRequest = function() {
    var max32 = Math.pow(2, 32) - 1;
    var address = Math.floor(Math.random() * max32);
    $scope.tieredCache.resolveRequest( address );
  };

  $scope.randomRequestToggle = function() {
    if( $scope.repeatHandle != 0 ) {
      clearInterval( $scope.randomAccessesHandle );
      $scope.randomAccessesHandle = 0;
    } else {
      $scope.repeatHandle = setInterval( function() {
        $scope.randomRequest();
        $scope.$apply();
      }, 50 );
    }
  };
});
