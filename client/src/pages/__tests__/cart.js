import React from 'react'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { renderApollo, cleanup, waitForElement } from '../../test-utils'
import Cart, { GET_CART_ITEMS } from '../cart'

describe('Cart Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup)

  it('renders with message for empty carts', () => {
    const cache = new InMemoryCache()
    cache.writeQuery({
      query: GET_CART_ITEMS,
      data: { cartItems: [] },
    })

    let mocks = [
      {
        request: { query: GET_CART_ITEMS },
        result: { data: { cartItems: [] } },
      },
    ]
    const { getByTestId } = renderApollo(<Cart />, {
      mocks,
      cache,
      resolvers: {},
    })
    return waitForElement(() => getByTestId('empty-message'))
  })

  it('renders cart', () => {
    const cache = new InMemoryCache()
    cache.writeQuery({
      query: GET_CART_ITEMS,
      data: { cartItems: [1] },
    })

    let mocks = [
      {
        request: { query: GET_CART_ITEMS },
        result: { data: { cartItems: [1] } },
      },
    ]
    const { getByTestId } = renderApollo(<Cart />, {
      mocks,
      cache,
      resolvers: {},
    })
    return waitForElement(() => getByTestId('book-button'))
  })
})
