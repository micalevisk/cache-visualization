// Angular controllers
// 4/20/2015
// Arthur Wuterich

app.controller('main', function($scope) {
  // Init main controller
  $scope.cacheSize = 10;
  $scope.blockSize = 1;
  $scope.addresses = "1 10 34 8";
  $scope.cacheSimulator = new CacheSimulator();

  // Event handlers
  $scope.initCache = function() {
    console.log( "Init cache with the following properties: CacheSize: ", $scope.cacheSize, ", BlockSize: ", $scope.blockSize );
    $scope.cacheSimulator = new CacheSimulator( $scope.cacheSize, $scope.blockSize );
  }
});
