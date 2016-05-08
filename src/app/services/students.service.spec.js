describe("Students service", function () {
    var studentsService, httpBackend, BASE_URL, URL, PAGINATION;

    beforeEach(module("app.admin.groups"));
    beforeEach(module("app"));

    beforeEach(inject(function (_studentsService_, $httpBackend, _BASE_URL_, _URL_, _PAGINATION_) {
        studentsService = _studentsService_;
        httpBackend = $httpBackend;
        BASE_URL = _BASE_URL_;
        URL = _URL_;
        PAGINATION = _PAGINATION_;
    }));

    it("should return head elements of table", function(){
        var headElements = ["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"];
        expect(studentsService.getHeadElements()).toEqual(headElements);
    });

    it("should get one student by id", function(){
        httpBackend.whenGET(BASE_URL + URL.ENTITIES.STUDENT + URL.GET_ENTITIES + 27).respond(
            [{   "user_id": "27",
                "gradebook_id": "КА-2789",
                "student_surname": "Охріменкоооооо",
                "student_name": "Дмитро",
                "student_fname": "Майкрософтович",
                "group_id": "5",
                "plain_password": "cert",
                "photo": ""
            }]
        );
        var studentInfo = {   "user_id": "27",
            "gradebook_id": "КА-2789",
            "student_surname": "Охріменкоооооо",
            "student_name": "Дмитро",
            "student_fname": "Майкрософтович",
            "group_id": "5",
            "plain_password": "cert",
            "photo": ""
        };
        studentsService.getStudentById().then(function(data) {
            expect(data).toEqual(studentInfo);
        })
    });

});
