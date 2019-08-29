controllers.controller('UserCtrl', function($scope, $state, $rootScope,  User, $http, $localstorage) {

  $scope.data = {
  	username:'',
  	password:''
  };

  $scope.login = function(){
  	User.login($scope.data).then(function(response){
  		if(!angular.isUndefined(response.data))
      {
  			$localstorage.setObject('user', response.data);
  			$state.go('tab.products');
  		}
  	})
  }

 	$scope.$on('$ionicView.beforeEnter', function(){
	  $user = $localstorage.getObject('user');

	  if(!angular.isUndefined($user))
    {
	  	if(!angular.isUndefined($user.data.token))
      {
	  		$state.go('tab.products');
	  	}
	  }
	});

})