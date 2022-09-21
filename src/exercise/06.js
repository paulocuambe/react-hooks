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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, error: null}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error}
  }

  componentDidCatch(error, errorInfo) {
    console.log({error, errorInfo})
  }

  render() {
    if (this.state.hasError) {
      //render error component
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

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
    throw error
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
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
