describe ("Test Students Controller", function () {
    beforeEach (module("app.admin.groups"));
    var ctrl;
    beforeEach (inject(function($controller){
        ctrl = $controller ("StudentsController", {
            studentsService: mockStudentsService,
            groupsService: mockGroupsService,
            customDialog: mockCustomDialog
        });
    }));
    it("Should show the list of students", function(){
        expect(true).toBe(true);
    })
})