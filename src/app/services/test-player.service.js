(function () {
    "use strict";

    angular.module("app.user")
        .factory("testPlayerService", testPlayerService);

    testPlayerService.$inject = ["$http", "$q", "BASE_URL", "URL", "testsService"];

    function testPlayerService($http, $q, BASE_URL, URL, testsService) {
        var service = {
            getData: getData,
            finishTest: finishTest,
            getTestInfo: getTestInfo,
            getTimeStamp: getTimeStamp,
            uncheckOtherAnswers: uncheckOtherAnswers
        };

        return service;

        function _successCallback(data) {
            return data;
        }

        function _errorCallback(response) {
            return response;
        }
        
        function getTestInfo(test_id) {
            return testsService.getOneTest(test_id).then(_successCallback, _errorCallback);
        }

        function _getTestDetailsByTest(test_id) {
            return testsService.getTestLevel(test_id).then(_successCallback, _errorCallback);
        }

        function _getQuestionsForTest(test_id, arrayTestDetails) {
            var deferred = $q.defer();
            var urlCallsQuestionsByLevel = [];
            angular.forEach(arrayTestDetails, function (item) {
                urlCallsQuestionsByLevel.push($http.get(BASE_URL + URL.ENTITIES.QUESTION +
                    URL.GET_QUESTIONS_BY_LEVEL_RAND + test_id + "/" + item.level + "/" + item.tasks));
            });
            $q.all(urlCallsQuestionsByLevel).then(function (response) {
                var questionsList = [];
                angular.forEach(response, function (questionsByLevel) {
                    var arrayQuestions = questionsByLevel.data;
                    questionsList = questionsList.concat(arrayQuestions);
                });
                deferred.resolve(questionsList);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }
        
        function _getAnswersForQuestions(questionsList) {
            var deferred = $q.defer();
            var urlCallsAnswersByQuestion = [];
            angular.forEach(questionsList, function (item) {
                urlCallsAnswersByQuestion[item.question_id] = $http.get(BASE_URL + URL.ENTITIES.SANSWER +
                    URL.GET_ANSWERS_BY_QUESTION + item.question_id);
            });
            $q.all(urlCallsAnswersByQuestion).then(function (response) {
                var answersList = [];
                angular.forEach(response, function (AnswersByQuestion) {
                    if (!AnswersByQuestion.data.response) {
                        var i = +(AnswersByQuestion.data[0]).question_id;
                        answersList[i] = AnswersByQuestion.data;
                        angular.forEach(answersList[i], function (answer) {
                            answer.checked = false;
                        });
                    }
                });
                deferred.resolve(answersList);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function _getTest(test_id) {
            return _getTestDetailsByTest(test_id).then(function (arrayTestDetails) {
                return _getQuestionsForTest(test_id, arrayTestDetails).then(function (questionsList) {
                    return _getAnswersForQuestions(questionsList).then(function (answersList) {
                        var test = questionsList;
                        angular.forEach(answersList, function (item) {
                            var question_id = item[0].question_id;
                            var questionPosition = questionsList.map(function (item) {
                                return item.question_id;
                            }).indexOf(question_id);
                            test[questionPosition].answers = answersList[(test[questionPosition]).question_id];
                        });
                        console.log(test);
                        // getTimeStamp().then();
                        _saveData(test).then(_successCallback, _errorCallback);
                        return test;
                    });
                });
            });
        }

        function _saveData(test) {
            return $http.post(BASE_URL + URL.ENTITIES.TEST_PLAYER + URL.SAVE_DATA, test)
                .then(function (response) {
                    return response.data;
                }, _errorCallback);
        }

        function getData(test_id) {
            return $http.get(BASE_URL + URL.ENTITIES.TEST_PLAYER + URL.GET_DATA)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return _getTest(test_id).then(function (data) {
                        return data;
                    });
                });
        }

        function uncheckOtherAnswers(choseAnswer, question) {
            angular.forEach(question.answers, function(answer) {
                if (choseAnswer.answer_id !== answer.answer_id) {
                    answer.checked = false;
                }
            });
        }
        
        function finishTest(test) {
            var checkAnswers = [];
            angular.forEach(test, function (question) {
                var checkQuestion = {};
                checkQuestion.question_id = question.question_id;
                checkQuestion.answer_ids = [];
                angular.forEach(question.answers, function (answer) {
                    if (answer.checked === true) {
                        console.log("answer.checked=true -------", checkQuestion.question_id);
                        console.log(checkQuestion);
                        checkQuestion.answer_ids.push(answer.answer_id);
                    } else {
                        console.log("answer.checked=false -------", checkQuestion.question_id);
                    }
                });
                if (checkQuestion.answer_ids.length === 0) {
                    console.log(checkQuestion.question_id, "-------- length === 0");
                    checkQuestion.answer_ids.push(0);
                }
                checkAnswers.push(checkQuestion);
            });

            return _checkAnswers(checkAnswers).then(_successCallback, _errorCallback);
        }

        function _checkAnswers(answers) {
            return $http.post(BASE_URL + URL.ENTITIES.SANSWER + URL.CHECK_ANSWERS, answers)
                .then(function (response) {
                    return response.data;
                }, _errorCallback);
        }

        function getTimeStamp() {
            return $http.post(BASE_URL + URL.ENTITIES.TEST_PLAYER + URL.GET_TIME_STAMP)
                .then(function (response) {
                    return response.data;
                }, _errorCallback);
        }
    }

})();