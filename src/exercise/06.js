// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemonStatus, setPokemonStatus] = React.useState({
    status: 'idle',
    pokemon: null,
  })
  const [error, seError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setPokemonStatus({status: 'pending', pokemon: null})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemonStatus({status: 'resolved', pokemon: pokemonData})
      },
      error => {
        seError(error)
        setPokemonStatus({status: 'rejected'})
      },
    )
  }, [pokemonName])

  if (pokemonStatus.status === 'idle') {
    return 'Submit a pokemon'
  } else if (pokemonStatus.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (pokemonStatus.status === 'rejected') {
    if (error) {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    }
  } else if (pokemonStatus.status === 'resolved') {
    return <PokemonDataView pokemon={pokemonStatus.pokemon} />
  }

  throw new Error('Impossible condition')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
