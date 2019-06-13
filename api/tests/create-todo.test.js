const { expect } = require('chai');
const testServer = require('./helpers/test-server');
const testDB = require('./helpers/test-db');
const assertResponse = require('./helpers/assert-response');

describe('POST /todo', function () {
    testServer.useInTest();
    testDB.useInTest();

    it('should respond with 400 status code if title is missing', async function () {
        const api = this.api;
        const request = api.post('/todo', {});
        return assertResponse.isValidationError(request, { title: 'required' });
    });

    it('should respond with 400 status code if title is empty', async function () {
        const api = this.api;
        const request = api.post('/todo', { title: ''});
        return assertResponse.isValidationError(request, { title: 'required' });
    });

    it('should respond with 400 status code if title is not a string', async function () {
        const api = this.api;
        const request = api.post('/todo', { title: 324656475689 });
        return assertResponse.isValidationError(request, { title: 'must be a string' });
    });

    it('responds with 200 { todo }', async function() {
        const api = this.api;

        const response = await api.post('/todo', {title: 'My Test Todo'});

        expect(response).to.have.property('status', 201);
        expect(response)
            .to.have.property('data')
            .that.is.an('object');
        expect(response.data)
            .to.have.property('_id')
            .that.is.a('string');
        expect(response.data).to.have.property('title', 'My Test Todo');
        expect(response.data).to.have.property('completed', false);
        expect(response.data)
            .to.have.property('createdAt')
            .that.is.a('string');
        expect(new Date(response.data.createdAt).valueOf()).to.be.closeTo(
            Date.now(),
            1000
        )
    });

    it('trims title from input', async function() {
        const api = this.api;

        const response = await api.post('/todo', { title: '  My Test Todo ' });

        expect(response).to.have.property('status', 201);
        expect(response.data).to.have.property('title', 'My Test Todo');
    })
});
