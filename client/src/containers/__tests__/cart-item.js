import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { renderApollo, cleanup, waitForElement } from '../../test-utils'
import CartItem, { GET_LAUNCH } from '../cart-item'

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    id: 1,
    name: 'tester',
  },
  mission: {
    name: 'test mission',
    missionPatch: '/',
  },
}

describe('cart item', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup)

  it('queries item and renders without error', () => {
    let mocks = [
      {
        request: { query: GET_LAUNCH, variables: { launchId: 1 } },
        result: { data: { launch: mockLaunch } },
      },
    ]

    // since we know the name of the mission, and know that name
    // will be rendered at some point, we can use getByText
    const { getByText } = renderApollo(
      <Router>
        <CartItem launchId={1} />
      </Router>,
      {
        mocks,
        addTypename: false,
      }
    )

    // check the loading state
    getByText(/loading/i)

    return waitForElement(() => getByText(/test mission/i))
  })

  it('renders with error state', () => {
    let mocks = [
      {
        request: { query: GET_LAUNCH, variables: { launchId: 1 } },
        error: new Error('aw shucks'),
      },
    ]

    // since we know the error message, we can use getByText
    // to recognize the error
    const { getByText } = renderApollo(
      <Router>
        <CartItem launchId={1} />
      </Router>,
      {
        mocks,
        addTypename: false,
      }
    )

    waitForElement(() => getByText(/error: aw shucks/i))
  })
})
