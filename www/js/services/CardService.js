services.factory('Card', function($http) {

	return {
		consult:function(cardId, $token)
		{
			return $http.get(BASE_URL + '/sales/consult/'+cardId,{
				headers:{ 
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Authorization':$token
				}
			});
		},
		consultSales:function(cardId, $token){
			return $http.get(BASE_URL + '/sales/consultSale/'+cardId,{
				headers:{ 
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Authorization':$token
				}
			});
		}
	}

})