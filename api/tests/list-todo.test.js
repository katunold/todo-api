const { expect } = require('chai');
const testServer = require('./helpers/test-server');
const testDB = require('./helpers/test-db');

describe('GET /todo', function () {
    testServer.useInTest();
    testDB.useInTest();

    it('should respond with 200 { todos }', async function () {
        const api = this.api;
        // create three todo items
        await api.post('/todo', { title: 'Todo 1' });
        await api.post('/todo', { title: 'Todo 2' });
        await api.post('/todo', { title: 'Todo 3' });

        // make the actual request to GET /todo
        const response = await api.get('/todo');

        // assert status code 200
        expect(response).to.have.property('status', 200);

        // assert that all the three todos are included
        expect(response)
            .to.have.nested.property('data.todo')
            .that.is.an('array')
            .of.lengthOf(3);

        const todos = response.data.todo;
        // assert that every todo contains all desired fields
        todos.forEach(todo => {
            expect(todo)
                .to.have.property('title')
                .that.is.a('string');
            expect(todo).to.have.property('completed', false);
            expect(todo)
                .to.have.property('createdAt')
                .that.is.a('string');
            expect(todo)
                .to.have.property('updatedAt')
                .that.is.a('string');
        })

        // assert that todos are listed in order of creation
        expect(todos.map(todo => todo.title)).to.deep.equal([
            'Todo 1',
            'Todo 2',
            'Todo 3'
        ])

    });
});
