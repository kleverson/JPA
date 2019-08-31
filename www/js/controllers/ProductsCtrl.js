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



	$scope.showLoading = function(name) {
	  $timeout(function(){
	  	$scope.title = name;
	  }, 500);
	  
      $ionicLoading.show({
         template: 'Buscando produtos de ' +name
      });
   	};

   	$scope.hideLoading = function(){
      $ionicLoading.hide();
   	};

	$scope.getData = function(standId, name){
		$scope.showLoading(name);

		$scope.total = 0;

		$timeout(function(){
			$scope.products = [];
			if(!angular.isUndefined($scope.user.data))
			{
				if(!angular.isUndefined($scope.user.data.token))
				{
					Product.getById($scope.user.data.token,standId).then(function(response){
						
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

					$scope.getStands();
				}
			}else{
				$state.go('login');
			}
		},2500)
	}

	$scope.getStands = function(){
		var stands = $localstorage.getObject('stands');
		$scope.$emit('stands', stands);
	}

	$scope.getMultipleStand = function(){
		var stands = $scope.user.data.stand;
		$scope.$emit('stands', stands);
	}

	 $scope.$on('stands', function(event, data) {
	  	$scope.stands.values.push(data);
	 });

	$scope.update = function(){
		$scope.getData($scope.stands.selected.id_barraca,$scope.stands.selected.nome);
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

	$scope.$on('$ionicView.beforeEnter', function()
	{

		$scope.user = $localstorage.getObject('user');
		if(parseInt($scope.user.data.profile) == 1){
			$scope.getStands();
		}else if($scope.user.data.stand.length > 1)
		{
			$scope.getMultipleStand();
		}else{
			$scope.getData($scope.user.data.stand[0].id_barraca, $scope.user.data.stand[0].nome);
		}
		
	});
})
