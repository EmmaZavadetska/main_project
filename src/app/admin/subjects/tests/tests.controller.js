(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("TestsController", TestsController);

    TestsController.$inject = ["$stateParams", "testsService", "subjectsService", "REGEXP", "PAGINATION", "customDialog"];

    function TestsController($stateParams, testsService, subjectsService, REGEXP, PAGINATION, customDialog) {
        var vm = this;
        vm.list = [];
        vm.headElements = testsService.getHeader();
        vm.status = testsService.getStatus();
        vm.formCollapsed = true;
        vm.hideForm = hideForm;
        vm.showForm = showForm;
        vm.allowSubmit = allowSubmit;
        vm.saveEntity = saveEntity;
        vm.removeTest = removeTest;
        vm.onlyNumber = REGEXP.ONLY_NUMBER;

        vm.entitiesPerPage = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = 1;
        vm.currentRecordsRange = 0;
        vm.getItemsPerPage = getItemsPerPage;
        activate();


        function activate() {
            testsService.getTestsBySubject($stateParams.subject_id).then(function(data) {
                vm.totalList = data;
                vm.list = [];
                getItemsPerPage();
                vm.totalItems = vm.totalList.length;
                if (vm.totalItems > PAGINATION.ENTITIES_RANGE_ON_PAGE) {
                    vm.showPagination = true;
                } else {
                    vm.showPagination = false
                }
            });

            subjectsService.getOneSubject($stateParams.subject_id).then(function(data) {
                vm.currentSubject = data.subject_name;
            });
        }

        function hideForm() {
            vm.formCollapsed = true;
        }

        function showForm(test) {
            vm.formCollapsed = false;
            if (test === undefined) {
                vm.test = {
                    subject_id: $stateParams.subject_id
                }
            } else{
                vm.test = test;
            }
        }

        function allowSubmit (obj) {
            if (obj !== undefined) {

                return !(obj.attempts && obj.tasks && obj.test_name && obj.time_for_test);
            } else {

                return true;
            }
        }

        function saveEntity () {
            customDialog.openConfirmationDialog().then(function() {
                testsService.saveTest(vm.test).then(function(data) {
                    vm.hideForm();
                    activate();
                    vm.test = {};
                })
            });
        }

        function removeTest(test) {
            customDialog.openDeleteDialog(test).then(function() {
                testsService.removeTest(test).then(function(res) {
                       activate();
                    });
            });
        }

        function getItemsPerPage() {
            vm.currentRecordsRange = (vm.currentPage - 1) * vm.entitiesPerPage;
            var end = vm.currentRecordsRange + vm.entitiesPerPage;
            if (vm.totalList.length > 0) {
                vm.list = vm.totalList.slice(vm.currentRecordsRange, end);
            }
        }
    }
})();