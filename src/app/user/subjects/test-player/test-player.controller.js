(function() {
    "use strict";

    angular.module("app.user")
        .controller("TestPlayerController", TestPlayerController);

    TestPlayerController.$inject = ["$stateParams", "testPlayerService"];

    function TestPlayerController($stateParams, testPlayerService) {
        var vm = this;
        vm.showQuestion = showQuestion;
        vm.finishTest = finishTest;

        activate();

        function activate() {
            getTest();
        }
        
        function getTest() {
            return testPlayerService.getData($stateParams.test_id).then(function(response) {
                console.log(response);
                vm.test = response;
                vm.question = vm.test[0];
            });
        }
        
        function showQuestion(question) {
            // console.log(question);
            vm.question = question;
        }

        function finishTest() {
            testPlayerService.finishTest(vm.test).then(function(response) {
                console.log(response);
            });
        }
    }
})();