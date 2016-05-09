describe("Admin service", function () {
	var adminService, httpBackend, BASE_URL, URL, ENTITIES_UKR;
	var rightQuerry = {
			"email": "right@email.com",
			"username": "right-user",
			"password": "right-password-1234"
		}, wrongQuerry = {
			"email": "wrong@email",
			"username": ""
		},
		admin = {id: 27},
		succsessCallback = {"response": "ok"},
		errorCallback = {"response": "Failed to validate array"};
		
	beforeEach(module("app.admin"));
	beforeEach(module("app"));

	beforeEach(inject(function (_adminService_, $httpBackend, _BASE_URL_, _URL_, _ENTITIES_UKR_) {
		adminService = _adminService_;
		httpBackend = $httpBackend;
		BASE_URL = _BASE_URL_;
		URL = _URL_;
		ENTITIES_UKR = _ENTITIES_UKR_;
	}));

	it("should return head elements of table", function() {
		var headElements = [" ", "Логін", "E-mail", "Останній вхід", "Візитів"];
		expect(adminService.getHeader()).toEqual(headElements);
	});

	it("should get list of admins", function() {
		var admins = [
			{
				"id": "1",
				"email": "admin@dtapi.if.ua",
				"username": "admin",
				"password": "1qaz2wsx",
				"logins": "100",
				"last_login": "1462625642"
			},
			{
				"id": "27",
				"email": "root@dtapi.if.ua",
				"username": "root",
				"password": "1qaz2qaz",
				"logins": "10",
				"last_login": "1462622564"
			}
		];
		httpBackend.whenGET(BASE_URL + URL.ENTITIES.ADMINS + URL.GET_ENTITIES).respond(admins);
		adminService.getAdmins().then(function(data) {
			expect(data).toEqual(admins);
		});
	});

	it ("should get succsess callback on ADDING new admin with right data and response with error on wrong data", function() {
		var	succsessCallback = {"id": "42", "response": "ok"};
		httpBackend.whenPOST(BASE_URL + URL.ENTITIES.ADMINS + URL.ADD_ENTITY, rightQuerry).respond(succsessCallback);
		httpBackend.whenPOST(BASE_URL + URL.ENTITIES.ADMINS + URL.ADD_ENTITY, wrongQuerry).respond(errorCallback);
		adminService.addAdmin(rightQuerry).then(function(data) {
			expect(data).toEqual(succsessCallback);
		});
		adminService.addAdmin(wrongQuerry).then(function(data) {
			expect(data).toEqual(errorCallback);
		});
	});

	it ("should get succsess callback on EDIT admin with right data and response with error on wrong data", function() {
		httpBackend.whenPOST(BASE_URL + URL.ENTITIES.ADMINS + URL.EDIT_ENTITY + admin.id, rightQuerry).respond(succsessCallback);
		httpBackend.whenPOST(BASE_URL + URL.ENTITIES.ADMINS + URL.EDIT_ENTITY + admin.id, wrongQuerry).respond(errorCallback);
		adminService.editAdmin(rightQuerry).then(function(data) {
			expect(data).toEqual(succsessCallback);
		});
		adminService.editAdmin(wrongQuerry).then(function(data) {
			expect(data).toEqual(errorCallback);
		});
	});

	it ("should get succsess callback on DELETE admin", function() {
		httpBackend.whenGET(BASE_URL + URL.ENTITIES.ADMINS + URL.REMOVE_ENTITY + admin.id).respond(succsessCallback);
		adminService.removeAdmin(admin.id).then(function(data) {
			expect(data).toEqual(succsessCallback);
		});
	});
});
