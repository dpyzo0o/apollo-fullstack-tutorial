import React, { Fragment, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { LaunchTile, Header, Button, Loading } from '../components'

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String, $pageSize: Int) {
    launches(after: $after, pageSize: $pageSize) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`

export default function Launches() {
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false)
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES)

  function handleClick() {
    setFetchMoreLoading(prev => !prev)
    fetchMore({
      variables: {
        after: data.launches.cursor,
        pageSize: 5,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setFetchMoreLoading(prev => !prev)
        if (!fetchMoreResult) return prev
        return {
          ...fetchMoreResult,
          launches: {
            ...fetchMoreResult.launches,
            launches: [
              ...prev.launches.launches,
              ...fetchMoreResult.launches.launches,
            ],
          },
        }
      },
    })
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <p>ERROR</p>
  }

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches &&
        data.launches.hasMore &&
        (fetchMoreLoading ? (
          <Loading />
        ) : (
          <Button onClick={handleClick}>Load More</Button>
        ))}
    </Fragment>
  )
}
