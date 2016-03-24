(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("SchedulesController", SchedulesController);

    SchedulesController.$inject = ['schedulesService', 'groupsService', 'subjectsService', '$stateParams'];

    function SchedulesController(schedulesService, groupsService, subjectsService, $stateParams) {
        var vm = this;
        vm.associativeGroups = {};
        vm.associativeSubjects = {};

    // Callbacks for communication with backend
        function _applyDataCallback(data) {                      // callback for getting groups data from backend
            vm.list = Array.isArray(data) ?  data : [];          // to prevent the error if picked speciality or faculty has no groups
            vm.totalItems = data.length;
        }
    // CRUD
        vm.schedulesForGroup = function(group_id) {
            group_id == null ? activate() : schedulesService.getSchedulesForGroup(group_id).then(_applyDataCallback);
        }

        vm.schedulesForSubject = function(subject_id) {
            subject_id == null ? activate() : schedulesService.getSchedulesForSubject(subject_id).then(_applyDataCallback);
        }

        //vm.getGroupsByFaculty = function(f_id) {
        //    vm.selectedSpeciality = null;                        // to reset select tag of specialities
        //    f_id == null ? activate() : groupsService.getGroupsByFaculty(f_id).then(_applyDataCallback);
        //}


        if ($stateParams.entity === 'group') {
            vm.schedulesForGroup($stateParams.entity_id);

            groupsService.getGroup($stateParams.entity_id)
                .then(function(data) {
                    vm.group = data[0];
                })
        } else if ($stateParams.entity === 'subject') {
            vm.schedulesForSubject($stateParams.entity_id);

            subjectsService.getOneSubject($stateParams.entity_id)
                .then(function(data) {
                    vm.subject = data[0];
                })
        } else {

        }


        groupsService.getGroups().then(function(data) {
            vm.groups = data;
            for (var i = 0; i < vm.groups.length; i++) {
                vm.associativeGroups[+vm.groups[i].group_id] = vm.groups[i].group_name;
            }
        });
        subjectsService.getAllSubjects().then(function(data) {
            vm.subjects = data;
            for (var i = 0; i < vm.subjects.length; i++) {
                vm.associativeSubjects[+vm.subjects[i].subject_id] = vm.subjects[i].subject_name;
            }
        });


        // table headers
        //vm.headers = schedulesService.headers();

        //////////////////////////////////////////////////////////
        vm.test = function() {
            console.log('sraka');
            console.log(vm.list);
            console.log(vm.group);
        }
        //////////////////////////////////////////////////////////
    }
})();