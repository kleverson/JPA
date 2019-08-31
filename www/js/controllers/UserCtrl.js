controllers.controller('UserCtrl', function($scope, $state, $rootScope,  User, Product, $timeout, $ionicLoading, $ionicPopup,  $http, $localstorage) {

  $scope.data = {
  	username:'',
  	password:''
  };

  $scope.login = function(){
    $ionicLoading.show({noBackdrop: true, duration: 1800,
      template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner> <br/> Autenticando'
    });
  	User.login($scope.data).then(function(response){
      $timeout(function(){
          if(!angular.isUndefined(response.data))
          {
            if(response.data.data == false){
               var alertPopup = $ionicPopup.alert({
                 title: 'Erro',
                 template: 'Usuário e/ou senha incorretos'
               });
            }else{
              $localstorage.setObject('user', response.data);
              $scope.getStands(response.data);
              
              $timeout(function(){
                
                $state.go('tab.products');
                $ionicLoading.hide();
              },1000)
            }
          }
      },2000)

  	
  	})
  }

  $scope.getStands = function(user){
    Product.getAll(user.data.token).then(function(response){
      if(!angular.isUndefined(response.data)){
        $localstorage.setObject('stands', response.data);
        $scope.$broadcast('stands', response.data);
      }
    });
  }

 	$scope.$on('$ionicView.beforeEnter', function(){
	  $user = $localstorage.getObject('user');

	  if(!angular.isUndefined($user))
    {
      $timeout(function(){
  	  	if(!angular.isUndefined($user.data))
        {
  	  		$state.go('tab.products');
  	  	}
      }, 3000)
	  }
	});

})