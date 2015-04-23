// Angular controllers
// 4/20/2015
// Arthur Wuterich

app.controller('main', function($scope) {
  // Init main controller
  $scope.cacheSize = 8;
  $scope.blockSize = 4;
  $scope.setSize   = 2;
  $scope.addresses = "";
  $scope.randomAccessesHandle = 0;
  $scope.tieredCache = new TieredCache( new CacheSimulator(), 100 );

  // Event handlers
  $scope.initCache = function() {
    $scope.tieredCache.addCacheLevel( new CacheSimulator() );
  };

  $scope.processAddress = function() {
    if( $scope.addresses.length ) {
      console.log( "Process the provided address: ", $scope.addresses );
      $scope.tieredCache.resolveRequest( $scope.addresses );
    }

    $scope.addresses = "";
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

  $scope.randomRequest = function() {
    var max32 = Math.pow(2, 32) - 1;
    var address = Math.floor(Math.random() * max32);
    $scope.tieredCache.resolveRequest( address );
  };

  $scope.randomRequestToggle = function() {
    if( $scope.randomAccessesHandle != 0 ) {
      clearInterval( $scope.randomAccessesHandle );
      $scope.randomAccessesHandle = 0;
    } else {
      $scope.randomAccessesHandle = setInterval( function() {
        $scope.randomRequest();
        $scope.$apply();
      }, 50 );
    }
  };
});
