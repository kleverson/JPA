controllers.controller('TabCtrl', function($scope, $rootScope, $state, $stateParams, User, Card, $http, $cordovaBarcodeScanner, $ionicLoading, $localstorage) {

  $scope.response = false;
  $scope.user ={};

  $scope.getUser = function(){
  	$user = $localstorage.getObject('user');

  	$scope.user = $user;
  }

  $scope.getUser();

})