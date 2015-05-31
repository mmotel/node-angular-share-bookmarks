/* Controllers */

var appControllers = angular.module('appControllers', []);

appControllers.controller('MainAppCtrl',
  ['$scope', 'AuthService', 'Oplog',
  function($scope, AuthService, Oplog) {
    'use strict';
    //check if loggedin
    AuthService.verify();

    //subscribe to collections via oplog
  // Oplog.subscribe( 'category', {}, 'Category' );

    $scope.credentials = {
      "login": '',
      "password": ''
    };

    //sign in
    $scope.signin = function ( credentials ) {
      AuthService.signin( {
        'login': credentials.login,
        'password': credentials.password
      } );
    };
    //sign out
    $scope.signout = function () {
      AuthService.signout();
    };

}]).
controller('indexCtrl',
  ['$scope', 'Oplog',
  function( $scope, Oplog ) {
    'use strict';
    $scope.query = "";
    $scope.orderProp = "name";

    $scope.alterSub = function (query) {
      Oplog.alter('category', 'Category', {"name": query});
    };

    // $scope.$watch('query', function () {
    //   Oplog.alter('category', 'Category', {"name": $scope.query});
    // });

    $scope.rmSub = function () {
      Oplog.unsubscribe('category', 'Category');
    };

}]).
controller('signupCtrl',
  ['$scope', '$location',
  function( $scope, $location ) {
    'use strict';
    $scope.signupFailed = false;
    $scope.account = {
      "login": "",
      "password": ""
    };
    //sign up
    $scope.signup = function ( account ) {
    };

}]).
controller('showCategoriesCtrl',
  ['$rootScope', '$scope', '$location', '$routeParams', 'Oplog',
  function($rootScope, $scope, $location, $routeParams, Oplog ) {
    'use strict';

    $scope.User = {
      username: ''
    };

    $rootScope.Category = [];

    var username = $routeParams.username;
    console.log(username);

    Oplog.subscribe('users', {'username': username}, 'Users' ).then(function () {
      //onSuccess
      // console.log($scope.Users);
      if($scope.Users.length > 0){
        $scope.User = $scope.Users[0];
        console.log($scope.User);

        Oplog.subscribe('category', {'owner': $scope.User._id}, 'Category').
          then(function () {
            console.log($rootScope.Category);
            $scope.Category = $rootScope.Category;
          });

      }
    });
      // $scope.categories = [
      //   { '_id': 1, 'name': 'Category 1', 'description': 'Test category 1' },
      //   { '_id': 2, 'name': 'Category 2', 'description': 'Test category 2' },
      //   { '_id': 3, 'name': 'Category 3', 'description': 'Test category 3' },
      //   { '_id': 4, 'name': 'Category 4', 'description': 'Test category 4' },
      //   { '_id': 5, 'name': 'Category 5', 'description': 'Test category 5' }
      // ];

}]);
