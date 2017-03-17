'use strict';

/**
 * @ngdoc overview
 * @name telecomApp
 * @description
 * # telecomApp
 *
 * Main module of the application.
 */
var portfolioApp = angular
  .module('portfolioApp', ['ui.router', 'ngSanitize','angularMoment','angularUtils.directives.dirDisqus','ngDisqus','angularUtils.directives.dirPagination']); 
portfolioApp.constant('apiUrl', 'http://localhost:3000/');
portfolioApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider','$locationProvider','$disqusProvider',
  function ($httpProvider, $stateProvider, $urlRouterProvider,$locationProvider,$disqusProvider) {
    $disqusProvider.setShortname('zahidur-me');
    $stateProvider
      .state('app', {
        template: '<ui-view/>'
      })
      .state('app.home', {
        url: '/home',
        templateUrl: 'js/angular/views/home.html',
        controller:'HomeController'
      })
      .state('app.single_blog', {
        url: '/blog/:id',
        templateUrl: 'js/angular/views/single_blog.html',
        controller:'SingleBlogController'
      }).state('app.blogs', {
        url: '/blogs',
        templateUrl: 'js/angular/views/blogs.html',
        controller:'BlogsController'
      }).state('app.not_found', {
        url: '/404',
        templateUrl: 'js/angular/views/404.html',
        controller:'NotFoundController'
      });

$urlRouterProvider.otherwise(function($injector, $location){
  $injector.invoke(['$state', function($state) {
    $state.go('app.home', {}, { location: false } );
  }]);
}); 
  //  $urlRouterProvider.otherwise('/home');
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');    
  }
]);