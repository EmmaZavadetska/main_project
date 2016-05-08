describe("facultiesService test", function () {
    var facultiesService, httpBackend, BASE_URL, URL, PAGINATION;

    beforeEach(module("app.admin"));
    beforeEach(module("app"));

    beforeEach(inject(function (_facultiesService_, $httpBackend, _BASE_URL_, _URL_, _PAGINATION_) {
        facultiesService = _facultiesService_;
        httpBackend = $httpBackend;
        BASE_URL = _BASE_URL_;
        URL = _URL_;
        PAGINATION = _PAGINATION_;
    }));

    it("should return head elements of table", function(){
        var getHeader = ["Назва факультету", "Опис факультету"];
        expect(facultiesService.getHeader()).toEqual(getHeader);
    });
    it("should get faculties by name", function(){
        httpBackend.whenGET(BASE_URL + URL.ENTITIES.FACULTY + URL.GET_ENTITIES).respond(
            [{   "faculty_name": "Інститут Геології",
                 "faculty_description": "Корпус ГРФ (5), 20 поверх"
            }]
        );
    });
    it("should count entities", function(){
        httpBackend.whenGET(BASE_URL + URL.ENTITIES.FACULTY + URL.COUNT_ENTITY).respond(200, 10);
    });
});
