const cam = artifacts.require('./ControlAccessManagement.sol')

contract('ControlAccessManagement', (accounts) => {
    before(async () => {
        this.cam = await cam.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.cam.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists policies', async () => {
        const counter = await this.cam.policyCount()
        const data = await this.cam.policies(counter)
        assert.equal(data.id.toNumber(), counter.toNumber())
        assert.equal(data.deviceId, '')
        assert.equal(data.activity, '')
        assert.equal(data.requester, '')
        assert.equal(data.permission, false)
        assert.equal(counter.toNumber(), 1)
    })

    it('lists Activity Logs', async () => {
        const counter = await this.cam.activityLogCount()
        const data = await this.cam.activityLogs(counter)
        assert.equal(data.id.toNumber(), counter.toNumber())
        assert.notEqual(data.time.toNumber(), 0)
        assert.equal(data.deviceId, '')
        assert.equal(data.activity, '')
        assert.equal(data.requester, '')
        assert.equal(data.permission, false)
        assert.equal(counter.toNumber(), 1)
    })

    it('Create Activity Logs', async () => {
        const counter = await this.cam.activityLogCount()
        const data = await this.cam.activityLogs(counter)
        assert.equal(data.id.toNumber(), counter.toNumber())
        assert.notEqual(data.time.toNumber(), 0)
        assert.equal(data.deviceId, '')
        assert.equal(data.activity, '')
        assert.equal(data.requester, '')
        assert.equal(data.permission, false)
        assert.equal(counter.toNumber(), 1)
    })

    it('creates tasks', async () => {
        const result = await this.cam.createTask('A new task')
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new task')
        assert.equal(event.completed, false)
    })

    //   it('toggles task completion', async () => {
    //     const result = await this.todoList.toggleCompleted(1)
    //     const task = await this.todoList.tasks(1)
    //     assert.equal(task.completed, true)
    //     const event = result.logs[0].args
    //     assert.equal(event.id.toNumber(), 1)
    //     assert.equal(event.completed, true)
    //   })

})
