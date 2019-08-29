controllers.controller('ProductsCtrl', function($scope, $rootScope, $state, User, Product, $timeout, $http, $ionicPopup, $ionicLoading, $localstorage) {

	$scope.title = "";
	$scope.products = [];
	$scope.qtd = 0;
	$scope.total = 0;
	$scope.standId = 0;
	$scope.stands = {
		selected:null,
		values:[]
	};

	$scope.showLoading = function() {
      $ionicLoading.show({
         template: 'Buscando produtos...'
      });
   	};

   	$scope.hideLoading = function(){
      $ionicLoading.hide();
   	};

	$scope.$on('$ionicView.beforeEnter', function(){
		$user = $localstorage.getObject('user');

		$scope.getData($user.data.stand.id_barraca);
	});

	$scope.getData = function(standId){
		$user = $localstorage.getObject('user');
		$scope.showLoading();

		$timeout(function(){
			$scope.products = [];
			if(!angular.isUndefined($user.data))
			{
				if(!angular.isUndefined($user.data.token))
				{
					$scope.title = $user.data.stand.nome;

					if(parseInt($user.data.profile) == 1)
					{	
						var stands = $localstorage.getObject('stands');
						if(stands.length > 0){
							$scope.stands.values.push(stands)
						}else{
							Product.getAll($user.data.token).then(function(response){
								if(!angular.isUndefined(response.data)){
									$localstorage.setObject('stands', response.data);

									$scope.stands.values.push(response.data);
								}
							})
						}
					}


					Product.getById($user.data.token,standId).then(function(response){
						
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

	$scope.getStands = function(){

	}

	$scope.update = function(){
		$scope.getData($scope.stands.selected.id_barraca);
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
