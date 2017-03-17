angular.module('portfolioApp')
  .controller('HomeController', function($scope, $location, $state, $stateParams, $http, apiUrl) {
    //GET BLOGS
    $http({
      method: 'GET',
      url: apiUrl + 'posts'
    }).then(function(response) {
      $scope.blogs = response.data;
      //console.log($scope.blogs);
    }, function(error) {
      //console.log(error)
      // body...
    });

  })
  .controller('SingleBlogController', function($scope, $location, $state, $stateParams, $http, apiUrl) {
    if ($stateParams.id) {
      //DISQUS CONFIG
      $scope.disqusConfig = {
        disqus_shortname: 'zahidur-me',
        disqus_identifier: $stateParams.id,
        disqus_url: window.location.href
      };
      //GET SINGLE POST
      $http({
        method: 'GET',
        url: apiUrl + 'posts/' + $stateParams.id
      }).then(function(response) {
        $scope.blog = response.data;
      }, function(error) {
        $state.go('app.not_found');
      });
    } else {
      $state.go('app.not_found');
    }

    //GET ALL TAGS
    $http({
      method: 'GET',
      url: apiUrl + 'tags'
    }).then(function(response) {
      $scope.tags = response.data;
      //console.log($scope.tags);
    }, function(error) {
      //console.log(error)
    });

    //GET ALL POSTS

    $http({
      method: 'GET',
      url: apiUrl + 'posts'
    }).then(function(response) {
      $scope.blogs = response.data;
      //console.log($scope.blogs);
    }, function(error) {
      //console.log(error)
      // body...
    });

    //console.log(window);
    if(window.DISQUS){
    	console.log("Exist")
		DISQUS.reset({
		  reload: true,
		  config: function () {  
		      $scope.disqusConfig = {
		        disqus_shortname: 'zahidur-me',
		        disqus_identifier: $stateParams.id,
		        disqus_url: window.location.href
		      };
		  }
		});    	
    }







  })
  .controller('BlogsController', function($scope, $location, $state, $stateParams, $http, apiUrl) {
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    //////GET ALL TAGS
    $http({
      method: 'GET',
      url: apiUrl + 'tags'
    }).then(function(response) {
      $scope.tags = response.data;
      //console.log($scope.tags);
    }, function(error) {
      //console.log(error)
    });
    //GET ALL POSTS
    $http({
      method: 'GET',
      url: apiUrl + 'allposts'
    }).then(function(response) {
      $scope.allposts = angular.copy(response.data);
      //console.log($scope.allposts);
    }, function(error) {
      //console.log(error)
    });
    //AFTER CLICK TAG
    $scope.changeByTag = function(tag) {
      $http({
        method: 'GET',
        url: apiUrl + 'searchpostbytag/' + tag
      }).then(function(response) {
        $scope.allposts = angular.copy(response.data);
        //console.log($scope.allposts);
      }, function(error) {});
    }

  }).controller('NotFoundController', function($scope, $location, $state, $stateParams, $rootScope, $http, apiUrl) {
    $http({
      method: 'GET',
      url: apiUrl + 'tags'
    }).then(function(response) {
      $scope.tags = response.data;
      //console.log($scope.tags);
    }, function(error) {
      //console.log(error)
    });

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
      $state.go('app.blogs')
    });
  });