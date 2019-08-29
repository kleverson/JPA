services.factory('Product', function($http) {

	return {
		getAll:function($token)
		{
			return $http.get(BASE_URL + '/stand/getAll/',{
				headers:{ 
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Authorization':$token
				},
			})
		},
		getById:function($token, standId){
			return $http.get(BASE_URL + '/stand/getProductsByStand/'+ standId, {
				headers:{ 
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Authorization':$token
				},
			})
		},
		checkout:function(){
			// /sales/sell
		}
	}

})