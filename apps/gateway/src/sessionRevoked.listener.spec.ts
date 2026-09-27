import { consumeGroup } from '@power-paint/events'

import { dropCache } from './introspect'
import { listenSessionRevoked } from './sessionRevoked.listener'

jest.mock('@power-paint/events', () => ({ consumeGroup: jest.fn() }))
jest.mock('./introspect', () => ({ dropCache: jest.fn() }))

describe('listenSessionRevoked', () => {
	test('Отозванные в auth сессии должны пропадать из кэша шлюза', async () => {
		listenSessionRevoked()

		const [{ handler }] = jest.mocked(consumeGroup).mock.calls[0]

		await handler({ sessionTokens: ['session-1', 'session-2'] })

		expect(dropCache).toHaveBeenCalledWith('session-1')
		expect(dropCache).toHaveBeenCalledWith('session-2')
	})
})
