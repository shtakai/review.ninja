
module = angular.module('app', ['ui.router', 'ui.bootstrap', 'ninja.filters', 'frapontillo.bootstrap-switch', 'ngLoggly']);

filters = angular.module('ninja.filters', []);

// *************************************************************
// Delay start 
// *************************************************************

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

// *************************************************************
// Logger
// *************************************************************

module.config(['LogglyLoggerProvider', function(LogglyLoggerProvider) {
	LogglyLoggerProvider.inputToken('7e543a55-9a3c-4316-b456-335083061c84');
}]);

// *************************************************************
// States
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
		.state('home', {
			url:'/',
			templateUrl: '/templates/home.html',
			controller: 'HomeCtrl'
		})
		.state('repo', {
			url: '/:user/:repo',
			templateUrl: '/templates/repo.html',
			controller: 'RepoCtrl',
			resolve: {
				repo: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'get', {
						user: $stateParams.user,
						repo: $stateParams.repo
					});
				}]
			}
		})
		.state('comm', {
			url: '/:user/:repo/commit/:sha',
			templateUrl: '/templates/comm.html',
			controller: 'CommCtrl',
			resolve: {
				repo: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'get', {
						user: $stateParams.user,
						repo: $stateParams.repo
					});
				}],
				comm: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'getCommit', {
						user: $stateParams.user,
						repo: $stateParams.repo,
						sha: $stateParams.sha
					});
				}]
			}
		})
		.state('pull', {
			url: '/:user/:repo/pull/:number',
			templateUrl: '/templates/pull.html',
			controller: 'PullCtrl',
			resolve: {
				repo: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'get', {
						user: $stateParams.user,
						repo: $stateParams.repo
					});
				}],
				pull: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('pullRequests', 'get', {
						user: $stateParams.user,
						repo: $stateParams.repo,
						number: $stateParams.number
					});
				}]
			}
		});

	$urlRouterProvider.otherwise('/');

	$locationProvider.html5Mode(true);

}]);