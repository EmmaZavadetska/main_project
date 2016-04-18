(function() {
    "use strict";

    angular.module("app.user") 
        .controller("TestResultController", TestResultController);

    TestResultController.$inject = ["$stateParams", "testPlayerService", "testsService"];

    function TestResultController($stateParams, testPlayerService, testsService) {
        var vm = this;
        vm.tests = $stateParams.tests.sort(sortArraysOfObjectsByProperty('question_id'));
        vm.results = $stateParams.results.sort(sortArraysOfObjectsByProperty('question_id'));
        vm.headers = testPlayerService.getHeaders();
        vm.maxScore = 0;
        vm.userScore = 0;
        activate();
        function activate() {
            testsService.getTestLevel(vm.tests[0].test_id).then(function(data) {
                vm.associativeDetails = {};
                vm.testDetails = Array.isArray(data) ? data : [];
                vm.testDetails.forEach(function(detail) {
                    vm.maxScore += (+detail.tasks) * (+detail.rate);
                    vm.associativeDetails[+detail.level] = detail.rate;
                })

                for (var i = 0; i < vm.results.length; i++) {
                    if (vm.results[i].true === 1) {

                        console.log(vm.associativeDetails);
                        console.log(vm.tests[i].level);
                        vm.userScore += Number(vm.associativeDetails[vm.tests[i].level]);
                    }
                }

            });
        }
        function sortArraysOfObjectsByProperty(property) {
            return function(first, second) {
                return Number(first[property]) - Number(second[property]);
            }
        }
    }
})();