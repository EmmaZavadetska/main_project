(function() {
    "use strict";

    angular.module("app.user")
        .controller("TestPlayerController", TestPlayerController);

    TestPlayerController.$inject = ["testPlayerService", "TYPES_OF_QUESTION"];

    function TestPlayerController(testPlayerService, TYPES_OF_QUESTION) {
        var vm = this;
        vm.showQuestion = showQuestion;
        vm.isSimpleTypeOfQuestion = isSimpleTypeOfQuestion;
        vm.uncheckOtherAnswers = uncheckOtherAnswers;
        vm.isMultiTypeOfQuestion = isMultiTypeOfQuestion;
        vm.finishTest = finishTest;
        activate();

        function activate() {
            getTest();
        }
        
        function getTest() {
            return testPlayerService.getData().then(function(response) {
                // console.log(response);
                vm.test = response;
                vm.question = vm.test[0];
                getTestInfo(vm.test[0].test_id);
            });
        }

        function getTestInfo(test_id) {
            return testPlayerService.getTestInfo(test_id).then(function(response) {
                // console.log(response);
                vm.testInfo = response[0];
            });
        }

        function showQuestion(question) {
            vm.question = question;
        }

        function uncheckOtherAnswers(choseAnswer, question) {
            testPlayerService.uncheckOtherAnswers(choseAnswer, question);
        }

        function isSimpleTypeOfQuestion(question) {
            if (question.type === TYPES_OF_QUESTION.SIMPLE.VALUE) {
                return true;
            } else {
                return false;
            }
        }

        function isMultiTypeOfQuestion(question) {
            if (question.type === TYPES_OF_QUESTION.MULTI.VALUE) {
                return true;
            } else {
                return false;
            }
        }
        
        function finishTest() {
            return testPlayerService.finishTest(vm.test).then(function(response) {
                // console.log(vm.test);
                // console.log(response);
            });
        }
    }
})();