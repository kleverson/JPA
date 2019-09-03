controllers.controller('ResponseCtrl', function($scope, $rootScope, $state, $stateParams, User, Card, $http, $cordovaBarcodeScanner, $ionicLoading, $localstorage) {

  $scope.response = ($stateParams.status == "true") ? true : false;  
  $scope.balance = $stateParams.balance;
  $localstorage.removeObject('cart'); 
 

  $scope.backProducts = function()
  {
  	$localstorage.removeObject('cart'); 
  	$rootScope.balance = [];
  	$scope.balance = [];
  	$state.go('tab.products');
  }

});