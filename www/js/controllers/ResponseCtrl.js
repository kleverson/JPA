controllers.controller('ResponseCtrl', function($scope, $rootScope, $state, $stateParams, User, Card, $http, $cordovaBarcodeScanner, $ionicLoading, $localstorage) {

  $scope.response = ($stateParams.status == "true") ? true : false;

})