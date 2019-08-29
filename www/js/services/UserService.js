services.factory('User', function($http) {

	return {
		login:function(object){
			return $http.post(BASE_URL + '/user/login',JSON.stringify(object));
		}
	}

})