controllers.controller('ProductsCtrl', function($scope, $rootScope, $state, User, Product, $timeout, $http, $ionicPopup, $ionicLoading, $localstorage) {

	$scope.title = "";
	$scope.products = [];
	$scope.qtd = 0;
	$scope.total = 0;
	$scope.stands = {};

	$scope.showLoading = function() {
      $ionicLoading.show({
         template: 'Buscando produtos...'
      });
   	};

   	$scope.hideLoading = function(){
      $ionicLoading.hide();
   	};

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.getData();
	});

	$scope.getData = function(){
		$user = $localstorage.getObject('user');
		$scope.showLoading();

		$timeout(function(){
			$scope.products = [];
			if(!angular.isUndefined($user.data))
			{
				if(!angular.isUndefined($user.data.token))
				{
					$scope.title = $user.data.stand.nome;

					if(parseInt($user.data.profile) == 3)
					{	
						var stands = $localstorage.getObject('stands');

						console.log(stands.length);
						if(stands.length > 0){
							$scope.stands = stands;
						}else{
							Product.getAll($user.data.token).then(function(response){
								if(!angular.isUndefined(response.data)){
									$localstorage.setObject('stands', response.data);
								}
							})
						}
					}

					console.log($scope.standId);
					// $scope.standId = ($scope.standId > 0) ? $scope.standId : $user.data.stand.id_barraca;


					Product.getById($user.data.token,$user.data.stand.id_barraca).then(function(response){
						
						if(!angular.isUndefined(response.data))
						{
							var responsedata = response.data.products;
							for(var item in responsedata){
								responsedata[item].qtd = 0;
								responsedata[item].subtotal = 0;
								$scope.products.push(responsedata[item]);

							}

							$scope.hideLoading();
						}else{
							$state.go('login');
						}
		
					})
				}
			}else{
				$state.go('login');
			}
		},2500)
	}

	$scope.update = function(){
		console.log($scope.activeStand);
	}


	$scope.add = function(obj)
	{
		if(obj.estoque > 0){
			obj.qtd++;
			obj.subtotal = obj.valor * obj.qtd;
			$scope.setTotal();
		}else{
		   var alertPopup = $ionicPopup.alert({
		     title: 'Erro',
		     template: 'Produto sem estoque'
		   });
		}
	}

	$scope.rem = function(obj){
		if(obj.qtd > 0){
			obj.qtd--;
			obj.subtotal = obj.subtotal - obj.valor;
			$scope.setTotal();
		}
	}

	$scope.setTotal = function()
	{
		var total = 0;

		for(var item in $scope.products){
			total += $scope.products[item].subtotal;
		}

		$scope.total = total;
	}

	$scope.confirmCheckout = function() {

	   if($scope.total > 0){
		   var alertPopup = $ionicPopup.alert({
		     title: 'Pagamento',
		     template: 'Deseja efetuar o pagamento?'
		   });

		   alertPopup.then(function(res) {
		     $scope.checkout();
		   });
		}else{
		   var alertPopup = $ionicPopup.alert({
		     title: 'Erro',
		     template: 'Selecione o produto'
		   });
		}
	 };


	$scope.checkout = function()
	{
		$localstorage.removeObject('cart'); 

		var cart = $scope.products.filter(function(obj) {
		  return obj.qtd > 0;
		});

		var obj = {
			'items':cart,
			'total':$scope.total
		}

		$localstorage.setObject('cart', obj); 

		$state.go('checkout');

	}
})
