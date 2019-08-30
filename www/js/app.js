// Ionic Starter App

var BASE_URL = "http://app.jpa.rmater.org.br";

angular.module('PortasAbertas', ['ionic', 'portasabertas.controllers', 'portasabertas.services','ngCordova'])

.run(function($ionicPlatform, $rootScope, $localstorage, $state) {
  $ionicPlatform.ready(function() {

    $rootScope.userData = {};
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    function userdata(){
      $user = $localstorage.getObject('user');
      if(!angular.isUndefined($user.data)){
        $rootScope.userData = $user;
      }else{
        $state.go('login');
      }
    }

    $rootScope.logout = function(){
      $localstorage.removeObject('user');

      alert('xpto');

      $state.go('login');
    }
    //   var permissions = cordova.plugins.permissions;

    //    var listPermissions = [
    //     permissions.WRITE_EXTERNAL_STORAGE,
    //     permissions.READ_EXTERNAL_STORAGE,
    //     permissions.CAMERA
    //   ];

    //   permissions.requestPermissions(listPermissions, success, error);
   
    //   function error() {
    //     alert('Camera permission is not turned on');
    //   }
       
    //   function success( status ) {
    //     if( !status.hasPermission ) error();
    // }

    userdata();

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom'); 

  $stateProvider
  
  .state('login',{
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'UserCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.products', {
    parent:'tab',
    url: '/products',
    views: {
      'tab-products': {
        templateUrl: 'templates/products.html',
        controller: 'ProductsCtrl'
      }
    }
  })


  .state('tab.consult',{
    parent:'tab',
    url:'/consult',
    views:{
      'tab-card':{
        templateUrl:'templates/consult.html',
        controller:'ConsultCtrl'
      }
    }
  })

  .state('response', {
    url: '/response/:status',
    templateUrl: 'templates/response.html',
    controller: 'ResponseCtrl'
  })

  .state('checkout', {
    url: '/checkout',
    templateUrl: 'templates/checkout.html',
    controller: 'CheckoutCtrl'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

var controllers = angular.module('portasabertas.controllers', []);
var services = angular.module('portasabertas.services', []);