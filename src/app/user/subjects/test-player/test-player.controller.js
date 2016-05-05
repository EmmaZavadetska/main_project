(function() {
    "use strict";

    angular.module("app.user")
        .controller("TestPlayerController", TestPlayerController);

    TestPlayerController.$inject = ["authService", "studentsService", "testPlayerService", "testsService", 
        "TYPES_OF_QUESTION", "$state", "MESSAGE", "customDialog"];

    function TestPlayerController(authService, studentsService, testPlayerService, testsService, 
                                  TYPES_OF_QUESTION, $state, MESSAGE, customDialog) {
        var vm = this;
        vm.showQuestion = showQuestion;
        vm.isSimpleTypeOfQuestion = isSimpleTypeOfQuestion;
        vm.uncheckOtherAnswers = uncheckOtherAnswers;
        vm.isMultiTypeOfQuestion = isMultiTypeOfQuestion;
        vm.confirmFinishTest = confirmFinishTest;
        vm.finishTest = finishTest;
        vm.isTestFinish = false;
        activate();

        function activate() {
            getTest();
            getUser();
        }

        function getTest() {
            return testPlayerService.getData().then(function(response) {
                vm.test = response;
                vm.question = vm.test[0];
                getTestInfo(vm.test[0].test_id);
            });
        }

        function getTestInfo(test_id) {
            return testPlayerService.getTestInfo(test_id).then(function(response) {
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

        function confirmFinishTest() {
            customDialog.openConfirmationDialog(MESSAGE.END_TEST_CONFIRM).then(function() {
                finishTest();
            });
        }
        
        // // Oleh
        function getUser() {
            return authService.isLogged().then(function(response) {
                studentsService.getStudentById(response.id).then(function(response) {
                    vm.user = response;
                })
            });
        }

        function finishTest() {
            vm.isTestFinish = true;
            var userScore = 0;
            var maxScore = 0;
            var testResult = {};
            return testPlayerService.finishTest(vm.test).then(function (response) {
                vm.test.sort(sortArraysOfObjectsByProperty("question_id"));
                vm.results = response.sort(sortArraysOfObjectsByProperty("question_id"));
                var questions = [], answers = [];
                for (var i = 0; i < vm.results.length; i++) {
                    questions.push(vm.results[i].question_id);
                    answers.push(vm.results[i].true);
                }
                questions = questions.join('/');
                answers = answers.join('/');
                testsService.getTestLevel(vm.test[0].test_id).then(function (data) {
                    vm.testDetails = Array.isArray(data) ? data : [];
                    vm.associativeDetails = {};
                    vm.testDetails.forEach(function (detail) {
                        maxScore += (+detail.tasks) * (+detail.rate);
                        vm.associativeDetails[+detail.level] = detail.rate;
                    });
                    for (var i = 0; i < vm.results.length; i++) {
                        if (vm.results[i].true === 1) userScore += Number(vm.associativeDetails[vm.test[i].level]);
                    }
                    testPlayerService.getEndTime().then(function(response) {
                        var testDate = new Date(response.startTimeTest*1000);
                        testResult = {
                            student_id: vm.user.user_id,
                            test_id: vm.test[0].test_id,
                            session_date: testDate.toISOString().split('T')[0],
                            start_time: new Date(response.startTimeTest*1000).toISOString().substr(11,8),
                            end_time: new Date(response.endTimeTest*1000).toISOString().substr(11,8),
                            result: userScore,
                            questions: questions,
                            true_answers: answers,
                            answers: answers
                        };
                        submitTest(testResult, userScore, maxScore);
                    })
                })
            });
        }
        
        function submitTest(testResult, userScore, maxScore) {
            testPlayerService.submitTest(testResult).then(function(data) {
                console.log("Тест завершено");
                $state.go("user.finishTest", {userScore: userScore, maxScore: maxScore});
            })
        }

        function sortArraysOfObjectsByProperty(property) {
            return function(first, second) {
                return Number(first[property]) - Number(second[property]);
            }
        }
        // Oleh
    }
})();