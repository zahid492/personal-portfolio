app.controller('SinglePostController', function(
	$scope, 
	posts, 
	post, 
	auth, 
	alertService, 
	$uibModal, 
	$log, 
	$window, 
	$state,
	$sce
	){
		$scope.post = post;
		console.log(post);
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser();
		$scope.title = post.title;
		$scope.body = post.body;
		$scope.tags=post.tags;
		$scope.images=post.images;
		$scope.highlites=post.highlites;
		$scope.status=post.status;




		$scope.changeToBase64 = function(element, id) {
		      //$scope.imageFrame = true;
		      $scope.currentFile = element.files[0];
		      var reader = new FileReader();
		      reader.onload = function(event) {
		            $scope.image = $scope.currentFile;
		            $scope.image_frame = event.target.result;

                    $scope.$apply();
		        }
		         reader.readAsDataURL(element.files[0]);
		        console.log($scope.currentFile);
		        console.log( $scope.image_frame);

		       
		 }

        $scope.uploadImage=function(){
            var postId=post._id;
            var file={
            	image:$scope.image_frame
            }
        	posts.uploadFileToUrl(file,postId).then(function(){
				
				alertService.add("success", "Well done! You successfully edited your post.");
			});

         }
		$scope.editPost = function(){
			if($scope.title === ' ' || $scope.body === ' ') { return; }
			post.title = $scope.title;
			post.body = $scope.body;
			post.tags=$scope.tags;
			post.highlites=$scope.highlites;
			post.link=convertToSlug($scope.title);
			post.status=$scope.status;
			posts.edit(post).then(function(){
				$state.go('post', {id: post._id});
				alertService.add("success", "Well done! You successfully edited your post.");
			});
			alertService.clear();
		};

		function convertToSlug(Text)
		{
		    return Text
		        .toLowerCase()
		        .replace(/[^\w ]+/g,'')
		        .replace(/ +/g,'-')
		        ;
		}
		$scope.incrementUpvotes = function(post){
			posts.upvote(post);
		};

		$scope.showBtn = function(){
			if(post.author.username === $scope.currentUser){
				return true;
			}
			return false;
		};

		$scope.openDeleteModal = function () {
		    var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      templateUrl: 'views/deleteModal.html',
		      controller: 'DeleteModalCtrl',
		      controllerAs: '$ctrl',
		      size: 'lg',
		    });

		    modalInstance.result.then(function () {
		    	posts.delete(post).then(function(){
					$state.go('posts');
					alertService.add("success", "Well done! You successfully deleted your post.");
				});
		    alertService.clear();
		    });
	 	};

	  	$scope.openCommentModal = function (refObject,refId) {
		    var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'views/commentModal.html',
		      controller: 'CommentModalCtrl',
		      controllerAs: '$ctrl',
		      size: 'lg',
		      resolve: {
		        refObject: function () {
		          return refObject;
		        },
		        refId : function(){
		        	return refId
		        },
		        isLoggedIn : function(){
		        	return	$scope.isLoggedIn;
		        },
		        posts : function(){
		        	return posts;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		      $window.location.reload();
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
	 	};



/////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!//////////////////////////

  //   $scope.tags = [];
  
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



	 });

app.controller('DeleteModalCtrl', function ($uibModalInstance) {
  var $ctrl = this;
 	
  $ctrl.delete = function () {
 		$uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('CommentModalCtrl', function ($uibModalInstance, refObject,refId,isLoggedIn,posts) {
  var $ctrl = this;
  $ctrl.isLoggedIn = isLoggedIn;
 	
  $ctrl.ok = function () {
  		var newComment = {
  			body: $ctrl.comment.body,
  		}
  		 if (refObject == 'post') { 
  		 	newComment.post = refId;
  		 }
  		 if (refObject == 'comment') { 
  		 	newComment.comment= refId;
  		 }
 
		posts.addComment(newComment).then(function(comment) {
		});

 		$uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});