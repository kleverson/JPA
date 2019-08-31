controllers.controller('ConsultCtrl', function($scope, $rootScope, $state, $stateParams, User, Card, $http, $cordovaBarcodeScanner, $ionicLoading, $ionicModal, $ionicPopup, $timeout, $localstorage) {

  $scope.cardNumber = {};
  $scope.consult = {};
  $scope.msg = ""; 

  $scope.data = {
    name:'',
    lastname:'',
    document:''
  }
  $scope.scanBarcode = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {

      $scope.cardNumber = imageData.text; 

      if(!angular.isUndefined(imageData.text))
      {
        $scope.cardNumber = parseInt($scope.cardNumber.slice(0,-1));
        $user = $localstorage.getObject('user');

         var loading =$ionicLoading.show({noBackdrop: true, duration: 1800,
          template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner> <br/> Consultando'
        });

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

  // $scope.scanBarcode = function() {
  

  //   // $cordovaBarcodeScanner.scan().then(function(imageData) {


  //     // if(!angular.isUndefined(imageData.text))
  //     // {
  //       $scope.cardNumber = parseInt($scope.cardNumber.slice(0,-1));
  //       $user = $localstorage.getObject('user');

  //       Card.consult(parseInt($scope.cardNumber),$user.data.token).then(function(response){

      
  //         if(!angular.isUndefined(response.data.id_cartao)){
  //           $scope.consult = response.data;
  //         }else{
  //           var alertPopup = $ionicPopup.alert({
  //             title: 'Cartão',
  //             template: 'Cartão não encontrado'
  //           });
  //         }        // loading.hide();
  //       });
  //     // }

  //   // }, function(error) {

  //   //   var alertPopup = $ionicPopup.alert({
  //   //     title: 'Consulta',
  //   //     template: 'Não foi possível ler o código do cartão.'
  //   //   });

  //   // });
  // };

   $ionicModal.fromTemplateUrl('associate.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.associate = function() {
      $scope.modal.show();
    };

    $scope.associateCard = function(){
       $user = $localstorage.getObject('user');

      var obj = {
        cardNumber:$scope.cardNumber,
        name:$scope.data.name + ' ' + $scope.data.lastname,
        document:$scope.data.document
      };
      var msg = "";
      Card.associate($user.data.token,obj).then(function(response) {

        $scope.closeModal();
        if(!angular.isUndefined(response.data.status)){
          if(response.data.status == true){
            msg = 'Cartão associado com sucesso!';
          }else{
            msg = 'Houve um problema para associar o cartão, tente novamente!';
          }
        }else{
           msg = 'Houve um problema para associar o cartão, tente novamente!';
        }
        
        $scope.msg = msg;
        $scope.consult.status = "1";

        Card.consult(parseInt($scope.cardNumber),$user.data.token).then(function(response){

          if(!angular.isUndefined(response.data.id_cartao)){
            $scope.consult = response.data;
          }

        });

        $timeout(function(){
          $scope.msg = "";
        },4000)
      });
    }

    $scope.closeModal = function(){
      $scope.data = {
        name:'',
        document:''
      };
      $scope.modal.hide();
    }




  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.cardNumber = {};
    $scope.consult = {};
    $scope.scanBarcode();
	});

})