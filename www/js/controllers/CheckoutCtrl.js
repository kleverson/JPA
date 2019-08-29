controllers.controller('CheckoutCtrl', function($scope, $rootScope, $state, $cordovaBarcodeScanner, User, Card, Checkout, $ionicPopup, $ionicLoading, $localstorage) {

  $scope.cardNumber = {};

  $scope.scanBarcode = function() {
  	$cordovaBarcodeScanner.scan().then(function(imageData) {

  		$scope.cardNumber = imageData.text; 

  		if(!angular.isUndefined(imageData.text))
  		{
  			$scope.cardNumber = parseInt($scope.cardNumber.slice(0,-1));
  			$user = $localstorage.getObject('user');

  			Card.consult(parseInt($scope.cardNumber),$user.data.token).then(function(response){
  				var cart = $localstorage.getObject('cart'); 

             var loading = $ionicLoading.show({
              template: 'Finalizando a compra',
              duration: 3000
            });

  				if( parseInt(response.data.creditos) < cart.total )
  				{
            loading.hide();
  					$ionicPopup.confirm({
  						title: 'Saldo',
  						template: 'Saldo insuficiente. Saldo Atual:' + response.data.creditos +'. Tentar novamente?'
  					});

  					confirmPopup.then(function(res) {
  						$state.go('products');
  					});
  					
  				}else{

  					$user = $localstorage.getObject('user');

  					Checkout.pay($user.data.token, $scope.cardNumber, cart).then(function(response){
  						if(!angular.isUndefined(response.data.status)){

  							if(response.data.status == true){
  								$state.go('consult');
  							}

  						}
  					});

  					loading.hide();
  				}
  			});
  		}

  	}, function(error) {

  		var alertPopup = $ionicPopup.alert({
  			title: 'Pagamento',
  			template: 'Não foi possível ler o código do cartão. Gosta'
  		});

  		alertPopup.then(function(res) {
  			$scope.checkout();
  		});
  	});
  };


  $scope.showConfirm = function() {
  	var confirmPopup = $ionicPopup.confirm({
  		title: 'Erro',
  		template: 'Não foi possível ler o código do cartão. Tentar novamente?'
  	});

  	confirmPopup.then(function(res) {
  		if(res) {
  			$state.go('checkout');
  		} else {
  			$localstorage.removeObject('cart');
  			$state.go('products');
  		}
  	});
  };

  $scope.$on('$ionicView.beforeEnter', function(e) {
  	$scope.scanBarcode();
  });

})