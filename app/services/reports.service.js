(function() {
    "use strict";

    angular.module("app.admin")
        .factory("reportsService", reportsService);

    reportsService.$inject = ["$http", "$q", "BASE_URL", "URL", "groupsService", "studentsService", "testsService", "subjectsService", "schedulesService"];

    function reportsService($http, $q, BASE_URL, URL, groupsService, studentsService, testsService, subjectsService, schedulesService) {
        var results = [];

        var service = {
            getSubjects: getSubjects,
            getReport: getReport,
            updateGroupsBySubject: updateGroupsBySubject,
            updateTestsBySubject: updateTestsBySubject,
            getHeader: getHeader,
            getResultsDetail: getResultsDetail
        };

        return service;

        // callbacks functions
        function _successCallback(data) {
            return data;
        }
        function _errorCallback(response) {
            return response;
        }

        // get subjects for selectpicker in form
        function getSubjects() {
            return subjectsService.getAllSubjects().then(_successCallback, _errorCallback);
        }

        // update selectpicker Tests in form by choosing subject
        function updateTestsBySubject(subject_id) {
            return testsService.getTestsBySubject(subject_id).then(_successCallback, _errorCallback);
        }

        // update selectpicker Groups in form by choosing subject
        function updateGroupsBySubject(subject_id) {
            return _getTimesTableBySubject(subject_id).then(function(data) {
                var uniqueIdGroups = _uniqueItemsArray(data, "group_id");
                return _getGroupsBySubject(uniqueIdGroups);
            });
        }

        // get timeTeable by subject
        function _getTimesTableBySubject(subject_id) {
            return schedulesService.getSchedulesForSubject(subject_id)
                .then(_successCallback, _errorCallback);
        }

        // get gruops by subject
        function _getGroupsBySubject(arrayOfIdGroups) {
            return groupsService.getGroups().then(function(data) {
                var groups = data;
                var groupsBySubject = groups.filter(function(item) {
                    return arrayOfIdGroups.indexOf(item.group_id) > -1;
                });
                return groupsBySubject;
            });
        }

        // get array of unique property value of objects in array
        function _uniqueItemsArray(arrayOfObjects, propertyOfObject) {
            var uniqueItemsList = [];
            angular.forEach(arrayOfObjects, function(object) {
                if(uniqueItemsList.indexOf(object[propertyOfObject]) === -1){
                    uniqueItemsList.push(object[propertyOfObject]);
                }
            });

            return uniqueItemsList;
        }

        // create report by group and test
        function getReport(group_id, test_id) {
            return _getStudentsByGroup(group_id).then(function(data) {
                var arrayStudents = data;
                return _getResultByStudents(arrayStudents, test_id).then(function(data) {
                    var report = _addToResultsStudentsName(data, arrayStudents);
                    report = _addToResultsCountTrueAnswers(report);
                    results = report;
                    return report;
                });
            });
        }

        // get students by group
        function _getStudentsByGroup(group_id) {
            return studentsService.getStudentsByGroupId(group_id).then(_successCallback, _errorCallback);
        }

        // get result by student
        function _getResultByStudents(arrayStudents, test_id) {
            var deferred = $q.defer();
            var urlCallsResultsStudents = [];
            angular.forEach(arrayStudents, function (student) {
                urlCallsResultsStudents[student.user_id] =
                    $http.get(BASE_URL + URL.ENTITIES.RESULT + URL.GET_RESULTS_BY_STUDENT + student.user_id);
            });
            $q.all(urlCallsResultsStudents).then(function(response) {
                var filteredResults = [];
                angular.forEach(response, function(resultsOfStudent) {
                    var arrayResults = resultsOfStudent.data;
                    if (!arrayResults.hasOwnProperty("response")) {
                        var filteredArray = arrayResults.filter(function(item) {
                            if (item.test_id === test_id) {
                                return true;
                            }
                        });
                        if (filteredArray.length != 0) {
                            filteredResults = filteredResults.concat(filteredArray);
                        }
                    }
                });
                deferred.resolve(filteredResults);
            }, function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        // add to array of results for each object in array property student_surname, student_name,student_fname
        function _addToResultsStudentsName(arrayResults, arrayStudents) {
            var resultsWithStudentName = [];
            angular.forEach(arrayStudents, function(student) {
                var filteredArray = arrayResults.filter(function(result) {
                    if (result.student_id === student.user_id) {
                        result.student_surname = student.student_surname;
                        result.student_name = student.student_name;
                        result.student_fname = student.student_fname;
                        return true;
                    }
                });
                resultsWithStudentName = resultsWithStudentName.concat(filteredArray);
            });

            return resultsWithStudentName;
        }

        // add to array of results for each object in array property percentTrueAnswers
        function _addToResultsCountTrueAnswers(arrayResults) {
            angular.forEach(arrayResults, function(item) {
                var trueAnswers = item.true_answers.split("/").map(Number);
                var countTrueAnswers = trueAnswers.filter(function(item) { return item === 1; }).length;
                item.percentTrueAnswers = Math.round(countTrueAnswers * 100/ trueAnswers.length).toFixed(2);
            });
            
            return arrayResults;
        }

        function _countTestPassesByStudent(student_id, test_id) {
            return $http.get(BASE_URL + URL.ENTITIES.RESULT + URL.COUNT_TEST_PASSES_BY_STUDENT + student_id + "/" + test_id)
                .then(function(response){
                        if(response.status === 200) {
                            return response.numberOfRecords;
                        }
                    }, function(response){
                        return response;
                    });
        }

        function getHeader() {
            return ["Студент", "Рейтинг", "Якість", "Дата", "Початок тесту", "Кінець тесту"];
        }
        
        //Details of report
        function getResultsDetail(session_id) {
            var resultDetail = results.find(function(result) {
                return result.session_id === session_id;
            });
            return _getQuestionsByTest(resultDetail.test_id).then(function(data) {
                var trueAnswers = resultDetail.true_answers.split("/").map(Number);
                var questionsId = resultDetail.questions.split("/").map(Number);
                var i = 0;
                resultDetail.questionList = [];
                angular.forEach(questionsId, function(questionId) {
                    var question = data.find(function(question) {
                        return question.question_id === questionId;
                    });
                    var answer = trueAnswers[i] === 1 ? "Правильна" : "Неправильна";
                    questionList.push({question: question, answer: answer});
                    i++;
                });
                return resultDetail;
            });
        }

        function _getQuestionsByTest(test_id) {
            return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_RECORDS_RANGE_BY_TEST + test_id + "/" + "100" + "/" + "0" + "/")
                .then(_successCallback, _errorCallback);
        }
    }

})();