var FbLogin = angular.module("FbLogin", ["firebase"])
  .controller('MainCtrl', ['$scope', '$firebaseAuth', '$firebase', function($scope, $firebaseAuth, $firebase){
    
    var ref = new Firebase('https://jamesjacko.firebaseio.com');
    $scope.auth = $firebaseAuth(ref);
    $scope.data = $firebase(ref);
    $scope.login = function(){
      $scope.user = $scope.auth.$login('facebook').then(function(e){
        $scope.data[e.id] = e;
        $scope.data.$save(e.id);

      });
    };

  }])
  .directive('hello', function(){
    return{
      restrict: 'E',
      template: 'Hello, world!!'
    }
    
  })
  .directive('navigation', function(){
    return{
      restrict:'E',
      scope:{
        name:'@name'
      },
      template:'<ul><li>{{name}}</li><li>nav</li><li>nav</li><li>nav</li><li>nav</li><li>nav</li><li>nav</li></ul>'
    }
    
  });
