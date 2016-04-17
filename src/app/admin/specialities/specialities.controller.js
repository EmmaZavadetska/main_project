(function() {
    "use strict";

    angular.module("app.admin")
        .controller("SpecialitiesController", SpecialitiesController);

    SpecialitiesController.$inject = ["specialitiesService", "PAGINATION", "VALID"];

    function SpecialitiesController (specialitiesService, PAGINATION, VALID) {
        var vm = this;
        vm.showSaveForm = showSaveForm;
        vm.hideSaveForm = hideSaveForm;
        vm.saveFormCollapsed = true;
        vm.headElements = specialitiesService.getHeader();       
        vm.saveSpeciality = saveSpeciality;
        vm.removeSpeciality = removeSpeciality;
        vm.minNameLength = VALID.MIN_NAME_LENGTH;
        vm.maxNameLength = VALID.MAX_NAME_LENGTH;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage =  vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        activate();

        function activate() {
            specialitiesService.totalItems().then(function(quantity) {
                vm.totalItems = +quantity;
            });
            specialitiesService.getSpecialitiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }

        function showSaveForm(speciality) {
            vm.saveFormCollapsed = false;
            if (speciality === null) {
                vm.speciality = {};
            } else {
                vm.speciality = speciality;
            }
        }
        function hideSaveForm() {
            vm.saveFormCollapsed = true;
            vm.speciality = {};
        }

        function saveSpeciality() {
            specialitiesService.saveSpeciality(vm.speciality).then(function(res) {
                activate();
                vm.hideSaveForm();
            });
        }

        function removeSpeciality(speciality) {
            var message;
            if (confirm('Ви впевнені, що бажаєте видалити спеціальність "' + speciality.speciality_name + '"?')){
                specialitiesService.removeSpeciality(speciality.speciality_id).then(function(res) {
                    if (res.response.indexOf("error") >= 0) {
                        message = "За цією спеціальністю існують групи. Спочатку видаліть їх.";
                    } else {
                        message = 'Спеціальність "' + speciality.speciality_name + '" видалена';
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
            specialitiesService.getSpecialitiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }
    }
})();