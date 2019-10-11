import React from 'react'
import { Router, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { renderApollo, cleanup, waitForElement } from '../../test-utils'
import Launch, { GET_LAUNCH_DETAILS } from '../launch'

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    __typename: 'Rocket',
    id: 1,
    name: 'tester',
    type: 'test',
  },
  mission: {
    __typename: 'Mission',
    id: 1,
    name: 'test mission',
    missionPatch: '/',
  },
  site: 'earth',
  isInCart: false,
}

describe('Launch Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup)

  it('renders launch', async () => {
    const history = createMemoryHistory()
    history.push('/launch/1')

    const mocks = [
      {
        request: { query: GET_LAUNCH_DETAILS, variables: { launchId: 1 } },
        result: { data: { launch: mockLaunch } },
      },
    ]
    const { getByText } = await renderApollo(
      <Router history={history}>
        <Route path="/launch/:launchId">
          <Launch />
        </Route>
      </Router>,
      {
        mocks,
        resolvers: {},
      }
    )
    await waitForElement(() => getByText(/test mission/i))
  })
})
