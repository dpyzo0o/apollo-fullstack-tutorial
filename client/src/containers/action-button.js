import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { GET_LAUNCH_DETAILS } from '../pages/launch'
import { Button, Loading } from '../components'

// export all queries used in this file for testing
export { GET_LAUNCH_DETAILS }

export const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`

export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`

const IS_LAUNCH_IN_CART = gql`
  query IsLaunchInCart($launchId: ID!) {
    launch(id: $launchId) {
      id
      isInCart @client
    }
  }
`

export default function ActionButton({ isBooked, id, isInCart }) {
  const [cancelTrip, { loading, error }] = useMutation(CANCEL_TRIP, {
    variables: { launchId: id },
    refetchQueries: [
      {
        query: GET_LAUNCH_DETAILS,
        variables: { launchId: id },
      },
    ],
  })

  const [toggleCart] = useMutation(TOGGLE_CART, {
    variables: { launchId: id },
    update: cache => {
      const { launch } = cache.readQuery({
        query: IS_LAUNCH_IN_CART,
        variables: { launchId: id },
      })

      cache.writeQuery({
        query: IS_LAUNCH_IN_CART,
        variables: { launchId: id },
        data: {
          launch: {
            ...launch,
            isInCart: !launch.isInCart,
          },
        },
      })
    },
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <p>An error occurred</p>
  }

  return (
    <div>
      <Button
        onClick={isBooked ? cancelTrip : toggleCart}
        isBooked={isBooked}
        data-testid={'action-button'}
      >
        {isBooked
          ? 'Cancel This Trip'
          : isInCart
          ? 'Remove from Cart'
          : 'Add to Cart'}
      </Button>
    </div>
  )
}
