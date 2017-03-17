app.controller('PostController', function(
	$scope, 
	posts, 
	auth, 
	PostsResolver,
	alertService,$state, 
	$sce,
	$http
	){
		$scope.posts = PostsResolver;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.body = new String();

		$scope.viewby = 5;
		$scope.totalItems = $scope.posts.length;
		$scope.currentPage = 1;
		$scope.itemsPerPage = $scope.viewby;
		$scope.maxSize = 5; 

		//Pagination
		 $scope.setPage = function (pageNo) {
		    $scope.currentPage = pageNo;
		  };

		  $scope.pageChanged = function() {
		    console.log('Page changed to: ' + $scope.currentPage);
		  };

		$scope.setItemsPerPage = function(num) {
		  $scope.itemsPerPage = num;
		  $scope.currentPage = 1; 
		}
 		//End Pagination 

		$scope.newPost = function(){
			if($scope.title === ' ' || $scope.body === ' ') { return; }
			posts.create({
				title: $scope.title, 
				body: $scope.body,
				banner: $scope.banner,
				tags:$scope.tags,
				highlites:$scope.highlites,
				link:convertToSlug($scope.title),
				status:$scope.status
			}).then(function(){
				$state.go('home');
				alertService.add("success", "Well done! You successfully added a new post.");
			});
			alertService.clear();
		};

     $scope.tags = [];
  
	 $scope.items=[
	    { "name": "Ubuntu"},
	    { "name": "Linux"},
	    { "name": "Node JS"},
	    { "name": "Angular JS"},
	    { "name": "Facebook Graph API"},
	    { "name": "Express"},
	    { "name": "Rabbit MQ"},
	    { "name": "MySQL"},
	    { "name": "Mongo DB"},
	    { "name": "React JS"},            
	    { "name": "Postgre SQL"},
	    { "name": "Digitalocean"},
	    { "name": "Facebbok"}      
	   ];

  $scope.loadCategories = function($query) {
      var items =  $scope.items;
      return items.filter(function(item) {
        return item.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
  };


function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}


	}
);

app.filter('limitHtml', function() {
   return function(text, limit) {

       var changedString = String(text).replace(/<[^>]+>/gm, '');
       var length = changedString.length;
       var suffix = '...';

       return length > limit ? changedString.substr(0, limit - 1) + suffix : changedString;
   }
});

app.directive('slider',function() {
    var linker = function(scope, element, attr) {
        scope.$watch('photos', function () {
        $(".rslides").responsiveSlides({
         	auto: true,
	      	nav: true,
	      	speed: 500,
	        namespace: "callbacks",
	        pager: true,
        });
      });      
    };
    return {
        restrict: "A",
        link: linker
    }
}).directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);

// app.directive('slider', function() {
//     var linker = function(scope, element, attr) {

//     var selector = attr.sliderClassSelector;
//     var watchSelector = attr.sliderRefreshOnWatch;

//   scope.$watch(watchSelector, function() {
//         $('.'+selector).responsiveSlides({
//          	auto: true,
// 	      	nav: true,
// 	      	speed: 500,
// 	        namespace: "callbacks",
// 	        pager: true,
//         });
//       });      
//   };

//   return {
//     restrict: "A",
//     link: linker
//   }
// });



