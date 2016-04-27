(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("TestDetailsController", TestDetailsController);

    TestDetailsController.$inject = ["$stateParams", "testsService", "REGEXP", "customDialog"];

    function TestDetailsController($stateParams, testsService, REGEXP, customDialog) {
        var vm = this;
        vm.availableLevel = [];

        vm.headElements = testsService.getHeaderTestDetail();
        vm.removeTestLevel = removeTestLevel;
        vm.formCollapsed = true;
        vm.hideForm = hideForm;
        vm.showForm = showForm;
        vm.saveEntity = saveEntity;
        vm.availableTask = 0;
        vm.onlyNumber = REGEXP.ONLY_NUMBER;
        activate();


        function activate(){
            testsService.getOneTest($stateParams.test_id).then(function(data){
                vm.currentTest = data[0];
            });

            testsService.getTestLevel($stateParams.test_id).then(function(data){
                if(Array.isArray(data)) {
                    vm.list = data;
                    vm.summaryRate = 0;
                    vm.list.forEach(function (item) {
                        vm.summaryRate += (parseInt(item.tasks) * parseInt(item.rate));
                    })
                }else {
                    vm.summaryRate = 0; 
                    vm.list = [];
                }
            })
        }

        function hideForm() {
            vm.formCollapsed = true;
        }

        /**
         * Set ava wich available Level. If it's edit,  pushed level of edited object to array.
         * Count and set how much tasks are aviable. If it's edit,  added tasks of edited object to array.
         * Switch editing and adding.
         * @param {objject} testLevel get from template. When addfunction used it is undefined*/

        function showForm(testLevel) {
            vm.availableLevel = testsService.getLevel (vm.list);
            vm.availableTask =  testsService.availableTasks (vm.list, vm.currentTest.tasks);
            vm.formCollapsed = false;
            if (testLevel === undefined) {
                vm.testLevel = {
                    test_id: $stateParams.test_id
                }
            } else {
                vm.availableLevel.push(testLevel.level);
                vm.availableTask += parseInt(testLevel.tasks);
                vm.testLevel = testLevel;
            }
        }

        function saveEntity () {
            countAvailableTask ();
            customDialog.openConfirmationDialog().then(function() {
                testsService.saveTestLevel(vm.testLevel).then(function (data) {
                    activate();
                    vm.testLevel = {};
                    hideForm();
                })
            });
        }

        function removeTestLevel(testLevel) {
            customDialog.openDeleteDialog(testLevel).then(function(){
                testsService.removeTestLevel(testLevel.id).then(function (res) {
                    activate();
                })
            });
        }

        function countAvailableTask () {
            vm.availableTask =  testsService.availableTasks (vm.list, vm.currentTest.tasks);
        }
    }
})();