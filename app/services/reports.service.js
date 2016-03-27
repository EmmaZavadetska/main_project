(function() {
    "use strict";

    angular.module("app.admin")
        .factory("reportsService", reportsService);

    reportsService.$inject = ["$http", "$q", "BASE_URL", "URL", "groupsService", "studentsService", "testsService", "subjectsService"];

    function reportsService($http, $q, BASE_URL, URL, groupsService, studentsService, testsService, subjectsService) {
        var service = {
            getSubjects: getSubjects,
            getReport: getReport,
            updateGroupsBySubject: updateGroupsBySubject,
            updateTestsBySubject: updateTestsBySubject,
            getHeader: getHeader
        };

        return service;

        // callbacks functions
        function _successCallback(data) {
            console.log(data);
            return data;
        }
        function _errorCallback(response) {
            return response;
        }

        // get Subjects for selectpicker in form
        function getSubjects() {
            return subjectsService.getAllSubjects().then(_successCallback, _errorCallback);
        }

        // update selectpicker Tests and Groups in form by choosing subject
        function updateTestsBySubject(subject_id) {
            console.log("updateTestsBySubject");
            return testsService.getTestsBySubject(subject_id).then(_successCallback, _errorCallback);
        }

        function updateGroupsBySubject(subject_id) {
            console.log("updateGroupsBySubject");
            //when used serviceTimeTable replace response,response.data to data
            return _getTimesTableBySubjects(subject_id).then(function(response) {
                var uniqueIdGroups = _uniqueItemsArray(response.data, "group_id");
                return _getGroupsBySubject(uniqueIdGroups);
            });
        }

        function _getTimesTableBySubjects(subject_id) {
            console.log("_getTimesTableBySubjects");
            return $http.get(BASE_URL + "/timeTable/getTimeTablesForSubject/" + subject_id)
                .then(_successCallback, _errorCallback);
        }

        function _getGroupsBySubject(arrayOfIdGroups) {
            console.log("_getGroupsBySubject");
            return groupsService.getGroups().then(function(data) {
                var groups = data;
                var groupsBySubject = groups.filter(function(item) {
                    console.log("_filterByProperty");
                    return arrayOfIdGroups.indexOf(item.group_id) > -1;
                });
                return groupsBySubject;
            });
        }

        function _uniqueItemsArray(arrayOfObjects, propertyOfObject) {
            var uniqueItemsList = [];
            for (var i = 0; i < arrayOfObjects.length; i++) {
                if(uniqueItemsList.indexOf((arrayOfObjects[i])[propertyOfObject]) === -1){
                    uniqueItemsList.push((arrayOfObjects[i])[propertyOfObject]);
                }
            }

            return uniqueItemsList;
        }

        // create report by group and test
        function getReport(group_id, test_id) {
            console.log("getReport");
            return _getStudentsByGroup(group_id).then(function(data) {
                var arrayStudents = data;
                var urlCallsResultsStudents = [];
                angular.forEach(data, function(student) {
                    // console.log(student.user_id);
                    // _countTestPassesByStudent(student.user_id, test_id).then(function(data) {
                    //     console.log(data);
                    //     if (data != 0) {
                    //         console.log("true");
                            urlCallsResultsStudents[student.user_id] =
                                $http.get(BASE_URL + "result" + URL.GET_RESULTS_BY_STUDENT + student.user_id);
                        // }
                    // })
                });
                // console.log(urlCallsResultsStudents);
                return _getResultByStudents(urlCallsResultsStudents, test_id).then(function(data) {
                    var report = _addToResultsStudentsName(data, arrayStudents);
                    report = _addToResultsCountTrueAnswers(report);
                    return report;
                });
            });
        }


        function _addToResultsCountTrueAnswers(arrayResults) {
            angular.forEach(arrayResults, function(item) {
                var trueAnswers = item.true_answers.split("/").map(Number);
                var countTrueAnswers = trueAnswers.filter(function(item) { return item === 1; }).length;
                item.percentTrueAnswers = Math.round(countTrueAnswers * 100/ trueAnswers.length).toFixed(2);
            });
            return arrayResults;
        }

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
            console.log(resultsWithStudentName);
            return resultsWithStudentName;
        }

        function _getResultByStudents(urlCallsResultsStudents, test_id) {
            console.log("_getResultByStudents");
            var deferred = $q.defer();
            $q.all(urlCallsResultsStudents).then(function(response) {
                var filteredResults = [];
                console.log(response);
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
                console.log(filteredResults);
                deferred.resolve(filteredResults);
            }, function(response) {
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        function _dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        function _getStudentsByGroup(group_id) {
            console.log("_getStudentsByGroup");
            return studentsService.getStudentsByGroupId(group_id).then(_successCallback, _errorCallback);
        }

        // function _getResultByStudent(user_id) {
        //     return $http.get(BASE_URL + URL.RESULT + URL.GET_RESULTS_BY_STUDENT + user_id)
        //         .then(_successCallback, _errorCallback);
        // }

        function _countTestPassesByStudent(student_id, test_id) {
            console.log("_countTestPassesByStudent");
            return $http.get(BASE_URL + URL.ENTITIES.RESULT + URL.COUNT_TEST_PASSES_BY_STUDENT + student_id + "/" + test_id)
                .then(function(response){
                        console.log(response);
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
        
        function _getQuestionsByTest(test_id) {
            return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_RECORDS_RANGE_BY_TEST + test_id + "/" + "100" + "/" + "0" + "/")
                .then(_successCallback, _errorCallback);
        }
    }

})();