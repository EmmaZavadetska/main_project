(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .factory("subjectsService", subjectsService);

    subjectsService.$inject = ["$http", "$q", "ENTITY_RANGE_ON_PAGE", "BASE_URL", "URL", "ENTITIES", "ACTIONS"];

    function subjectsService($http, $q, ENTITY_RANGE_ON_PAGE, BASE_URL, URL, ENTITIES, ACTIONS) {
        var service = {
            getSubjects: getSubjects,
            getAllSubjects: getAllSubjects,
            getOneSubject: getOneSubject,
            totalItems: totalItems,
            saveSubject: saveSubject,
            removeSubject: removeSubject,
            getHeader: getHeader
        };

        return service;

        function _successCallback(response) {
            return response.data;
        }
        function _errorCallback(response) {
            return response;
        }

        function getSubjects(currentRecordsRange){
             return $http.get(BASE_URL + ENTITIES.SUBJECT + ACTIONS.GET_ENTITY_RANGE + ENTITY_RANGE_ON_PAGE + "/" + currentRecordsRange)
                .then(_successCallback, _errorCallback);
        }


        function getAllSubjects(){
             return $http.get(BASE_URL + ENTITIES.SUBJECT + URL.GET_ENTITIES)
                .then(_successCallback, _errorCallback);
        }

        function getOneSubject(id) {
            return $http.get(BASE_URL + ENTITIES.SUBJECT + ACTIONS.GET_ENTITIES + id)
                .then(_successCallback, _errorCallback);
        }

        function totalItems(){
            var deferred = $q.defer();
            $http.get(BASE_URL + ENTITIES.SUBJECT + ACTIONS.COUNT_ENTITY)
                .then(function (res){
                        if(res.status === 200 && res.data.numberOfRecords) {
                            deferred.resolve(res.data.numberOfRecords)
                        }else {
                            deferred.reject(res)
                        }
                    },
                    function(res){
                        deferred.reject (res);
                    });

            return deferred.promise;
        }

        function saveSubject(subject) {
            if (subject.subject_id === undefined) {

                return _addSubject(subject);
            } else {

                return _editSubject(subject);
            }
        }

        function _addSubject (subject){

           return $http.post(BASE_URL + ENTITIES.SUBJECT + ACTIONS.ADD_ENTITY, subject)
                .then(_successCallback, _errorCallback);
        }

        function _editSubject(subject){

           return $http.post(BASE_URL + ENTITIES.SUBJECT + ACTIONS.EDIT_ENTITY  + subject.subject_id, subject)
                .then(_successCallback, _errorCallback);
        }

        function removeSubject(subject) {

            return $http.get(BASE_URL + ENTITIES.SUBJECT + ACTIONS.REMOVE_ENTITY + subject.subject_id)
                .then(_successCallback, _errorCallback);
        }

        function getHeader() {

            return ["Предмет", "Опис предмету"];
        }
    }

})();