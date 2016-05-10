describe('Controller: GroupsController', function() {
    var groupsService, specialitiesService, facultiesService, $stateParams, deferred, httpMock;
    $stateParams = {entity_id: 1};


    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $q, _groupsService_, _PAGINATION_, $controller) {
        scope = $rootScope.$new();
        groupsService = _groupsService_;
        PAGINATION = _PAGINATION_;

        deferred = $q.defer();
        spyOn(groupsService, 'getGroups').and.returnValue(deferred.promise);

        GroupsController = $controller('GroupsController', {
            $stateParams: $stateParams,
            $scope: scope
        });
    }));

    it('Activate function should get data for showing on view', function() {
        expect(GroupsController.activate).toBeDefined();
        expect(groupsService.getGroups).toHaveBeenCalled();
    });



    it('Preset values should be defined', function() {
        expect(GroupsController.showError).toBeDefined();
        expect(GroupsController.showError).toBeFalsy();
        expect(GroupsController.showFilterOverAction).toBeTruthy();
        expect(GroupsController.currentPage).toBe(1);
        expect(GroupsController.maxSize).toBeDefined();
        expect(GroupsController.entryLimit).toBeDefined();
        expect(angular.isObject(GroupsController.associativeSpeciality)).toBe(true);
        expect(angular.isObject(GroupsController.associativeFaculty)).toBe(true);
        expect(GroupsController.state_id).toBeDefined();
    });

    it('Methods should be defined', function() {
        expect(GroupsController.saveGroup).toBeDefined();
        expect(angular.isFunction(GroupsController.saveGroup)).toBe(true);

        expect(GroupsController.removeGroup).toBeDefined();
        expect(angular.isFunction(GroupsController.removeGroup)).toBe(true);

        expect(GroupsController.getGroupsByFaculty).toBeDefined();
        expect(angular.isFunction(GroupsController.getGroupsByFaculty)).toBe(true);

        expect(GroupsController.getGroupsBySpeciality).toBeDefined();
        expect(angular.isFunction(GroupsController.getGroupsBySpeciality)).toBe(true);

        expect(GroupsController.checkForError).toBeDefined();
        expect(angular.isFunction(GroupsController.checkForError)).toBe(true);

        expect(GroupsController.toggleFilterAction).toBeDefined();
        expect(angular.isFunction(GroupsController.toggleFilterAction)).toBe(true);

        expect(GroupsController.allowAdd).toBeDefined();
        expect(angular.isFunction(GroupsController.allowAdd)).toBe(true);
    });

    it('should switch between search and edit forms', function() {
        GroupsController.toggleFilterAction();
        expect(GroupsController.showFilterOverAction).not.toBe(true);
    });
});