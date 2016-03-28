(function() {
    "use strict";

    angular.module("app.admin")
        .controller("FacultiesController", FacultiesController);

    FacultiesController.$inject = ["facultiesService", "PAGINATION", "FACULTIES_CONST", "MESSAGE"];

    function FacultiesController (facultiesService, PAGINATION, FACULTIES_CONST, MESSAGE) {
        var vm = this;
        vm.showSaveForm = showSaveForm;
        vm.hideSaveForm = hideSaveForm;
        vm.saveFormCollapsed = true;
        vm.headElements = facultiesService.getHeader();
        vm.saveFaculty = saveFaculty;
        vm.removeFaculty = removeFaculty;
        vm.minNameLength = FACULTIES_CONST.MIN_CHAR_LENGTH;
        vm.maxNameLength = FACULTIES_CONST.MAX_CHAR_LENGTH;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        activate();

        function activate() {
            facultiesService.totalItems().then(function(quantity) {
                vm.totalItems = +quantity;
            });
            facultiesService.getFacultiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }

        function showSaveForm(faculty) {
            vm.saveFormCollapsed = false;
            if (faculty === null) {
                vm.faculty = {};
            } else {
                vm.faculty = faculty;
            }
        }
        function hideSaveForm() {
            vm.saveFormCollapsed = true;
            vm.faculty = {};
        }

        function saveFaculty() {
            facultiesService.saveFaculty(vm.faculty).then(function(res) {
                activate();
                vm.hideSaveForm();
            });
        }

        function removeFaculty(faculty) {
            var message;
            if (confirm( MESSAGE.DEL_CONFIRM + faculty.faculty_name + '"?')){
                facultiesService.removeFaculty(faculty.faculty_id).then(function(res) {
                    if (res.response.indexOf("error") >= 0) {
                        message = "За цим факультетом існують групи. Спочатку видаліть їх.";
                    } else {
                        message = 'Факультет "' + faculty.faculty_name + '" видалено';
                        activate();
                    }
                    alert(message);
                });
            }
        }


        function getNextRange() {
            vm.currentRecordsRange =(vm.currentPage - 1) * PAGINATION.ENTITIES_RANGE_ON_PAGE;
        }

        function pageChanged(){
            getNextRange();
            facultiesService.getFacultiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });

        }
    }
})();