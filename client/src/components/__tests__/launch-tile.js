import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { render, cleanup } from '../../test-utils'
import LaunchTile from '../launch-tile'

describe('Launch Tile', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup)

  it('renders without error', () => {
    render(
      <Router>
        <LaunchTile
          launch={{
            id: 1,
            mission: { name: 'the first one' },
            rocket: { name: 'harambe' },
          }}
        />
      </Router>
    )
  })
})
