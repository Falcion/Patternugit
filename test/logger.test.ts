import { expect } from 'chai' // eslint-disable-line n/no-missing-import
import { LOCALE_LOGGER } from '../index'
import sinon from 'sinon' // eslint-disable-line n/no-missing-import
import chalk from 'chalk'

describe('LOCALE_LOGGER', () => {
    let logger: LOCALE_LOGGER
    let consoleStub: sinon.SinonStub

    beforeEach(() => {
        logger = new LOCALE_LOGGER()
        consoleStub = sinon.stub(console, 'info')
    })

    afterEach(() => {
        consoleStub.restore()
    })

    it('should format info messages correctly', () => {
        logger.info('Test message', 123, { key: 'value' }, {})

        const output = consoleStub.firstCall.args[0]
        expect(output).to.include('Test message')
        expect(output).to.include('123')
        expect(output).to.include(chalk.blue(''))
        expect(output).to.include('{}')
    })
})
