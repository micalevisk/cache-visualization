// Angular controllers
// 4/20/2015
// Arthur Wuterich

app.controller('main', function($scope) {
  // Init main controller
  $scope.cacheSize = 8;
  $scope.blockSize = 1;
  $scope.setSize   = 1;
  $scope.addresses = "";
  $scope.cacheSimulator = new CacheSimulator();

  // Event handlers
  $scope.initCache = function() {
    console.log( "Init cache with the following properties: CacheSize: ", $scope.cacheSize, ", BlockSize: ", $scope.blockSize, ", SetSize: ", $scope.setSize );
    $scope.cacheSimulator = new CacheSimulator( $scope.cacheSize, $scope.blockSize, $scope.setSize );
  }

  $scope.processAddress = function() {
    if( $scope.addresses.length ) {
      console.log( "Process the provided address: ", $scope.addresses );
      $scope.cacheSimulator.resolveRequest( $scope.addresses );
    }

    $scope.addresses = "";
  }
});
