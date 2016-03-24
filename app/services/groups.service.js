(function() {
    "use strict";

    angular.module("app.admin.groups")
        .factory("groupsService", groupsService);

        groupsService.$inject = ['$http', 'URL', 'BASE_URL', 'MESSAGE'];

        function groupsService($http, URL, BASE_URL, MESSAGE) {
            var groupsService = {
                getGroups: getGroups,
                getGroupsByFaculty: getGroupsByFaculty,
                getGroupsBySpeciality: getGroupsBySpeciality,
                removeGroup: removeGroup,
                saveGroup: saveGroup,
                headers: headers
            };
            return groupsService;

            // callbacks
            function _successCallback(result) {
                return result.data;
            }
            function _errorCallback(reason) {
                return reason;
            }
            // CRUD
                // get all the groups
            function getGroups() {
                return $http.get(BASE_URL + URL.ENTITIES.GROUP + URL.GET_ENTITIES).then(_successCallback, _errorCallback);
            }
                // get groups by faculty ID
            function getGroupsByFaculty(f_id) {
                return $http.get(BASE_URL + URL.ENTITIES.GROUP + URL.GET_GROUPS_BY_FACULTY + f_id).then(_successCallback, _errorCallback);
            }
                // get groups by speciality ID
            function getGroupsBySpeciality(s_id) {
                return $http.get(BASE_URL + URL.ENTITIES.GROUP + URL.GET_GROUPS_BY_SPECIALITY + s_id).then(_successCallback, _errorCallback);
            }
                // delete
            function removeGroup(group_id) {
                return $http.get(BASE_URL + URL.ENTITIES.GROUP + URL.REMOVE_ENTITY + group_id).then(_successCallback, _errorCallback);
            }
                // create/update
            function saveGroup(group) {
                if (group.group_id === undefined) {
                    return $http.post(BASE_URL + URL.ENTITIES.GROUP + URL.ADD_ENTITY, group).then([_successCallback, console.log("Групу додано до бази даних")], _errorCallback)
                } else {
                    return $http.post(BASE_URL + URL.ENTITIES.GROUP + URL.EDIT_ENTITY + group.group_id, group).then([_successCallback, console.log("Зміни внесено до бази даних")], _errorCallback)
                }
            }
            // HEADERS OF THE GROUPS TABLE
            function headers() {
                return [
                    "Назва",
                    "Факультет",
                    "Спеціальність",
                    "Дія"
                ];
            }
        }
})();
