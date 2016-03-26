(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("SubjectsController", SubjectsController);

    SubjectsController.$inject = ["subjectsService", "PAGINATION", "MESSAGE"];

    function SubjectsController (subjectsService, PAGINATION, MESSAGE) {
        var vm = this;
        vm.headElements = subjectsService.getHeader();
        vm.formCollapsed = true;
        vm.hideForm = hideForm;
        vm.showForm = showForm;
        vm.saveEntity = saveEntity;
        vm.removeSubject = removeSubject;
        vm.entitiesPerPage = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = 1;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        activate();

        function activate() {
            subjectsService.totalItems().then(function (quantity) {
                vm.totalItems = +quantity;
                if (vm.totalItems > PAGINATION.ENTITIES_RANGE_ON_PAGE) {
                    vm.showPagination = true;
                } else {
                    vm.showPagination = false
                }
            });
            subjectsService.getSubjects(vm.currentRecordsRange).then(function (data) {
                if (Array.isArray(data)) {
                    vm.list = data;
                } else {
                    vm.list = [];
                }
            })}

        function hideForm() {
            vm.formCollapsed = true;
        }

        function saveEntity () {
            subjectsService.saveSubject(vm.subject).then(function (data) {
                if (data.response === "ok"){
                    alert(MESSAGE.SAVE_SUCCSES);

                } else {
                    alert(MESSAGE.SAVE_ERROR);
                }
                activate();
                hideForm();
                vm.subject = {};
            })
        }

        function showForm(subject) {
            vm.formCollapsed = false;
            if (subject === undefined) {
                vm.subject = {}
            } else {
                vm.subject = subject;
            }
        }

        function removeSubject(subject) {
            if (confirm(MESSAGE.DEL_CONFIRM)){
                subjectsService.removeSubject(subject).then(function (res) {
                    if (res.response === "ok") {
                        alert(MESSAGE.DEL_SUCCESS)
                    } else if (res.response = "error 23000") {
                        alert(MESSAGE.DEL_ERROR);
                    }
                    activate();
                })
            }
        }

        function pageChanged () {
            vm.currentRecordsRange =(vm.currentPage - 1) * vm.entitiesPerPage;
            subjectsService.getSubjects(vm.currentRecordsRange).then(function (data) {
                vm.list = data;
            });
        }
    }
})();