services.factory('Checkout', function($http) {

	return {
		pay:function($token, $cardId, itens)
		{
			return $http({
				method:'post',
				headers:{ 
					"Content-Type":"application/json",
					'Authorization':$token
				},
				url:BASE_URL+'/sales/sell',
				data:{
					'cardId':$cardId,
					'itens':itens
				}
			});

		}
	}

})