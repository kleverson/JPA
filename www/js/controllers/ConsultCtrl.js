controllers.controller('ConsultCtrl', function($scope, $rootScope, $state, $stateParams, User, Card, $http, $cordovaBarcodeScanner, $ionicLoading, $localstorage) {

  $scope.cardNumber = {};
  $scope.consult = {};

  $scope.scanBarcode = function() {
  

    $cordovaBarcodeScanner.scan().then(function(imageData) {

      $scope.cardNumber = imageData.text; 

      if(!angular.isUndefined(imageData.text))
      {
        $scope.cardNumber = parseInt($scope.cardNumber.slice(0,-1));
        $user = $localstorage.getObject('user');

        Card.consult(parseInt($scope.cardNumber),$user.data.token).then(function(response){

          if(!angular.isUndefined(response.data.id_cartao)){
            $scope.consult = response.data;
          }else{
            var alertPopup = $ionicPopup.alert({
              title: 'Cartão',
              template: 'Cartão não encontrado'
            });
          }

          loading.hide();
        });
      }

    }, function(error) {

      var alertPopup = $ionicPopup.alert({
        title: 'Consulta',
        template: 'Não foi possível ler o código do cartão.'
      });

    });
  };




  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.scanBarcode();
	});

})