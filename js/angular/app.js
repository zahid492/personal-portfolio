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
  .module('portfolioApp', ['ui.router', 'ngResource', 'ngSanitize','angularMoment','angularUtils.directives.dirDisqus','ngDisqus']); 
portfolioApp.constant('apiUrl', 'http://localhost:3000/api/');
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
        controller:'HomeController'
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