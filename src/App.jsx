import React, { useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery } from "@apollo/client";
import PaginationComponent from "./components/PaginationComponent";
import "./App.css";

//consuming API
const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

//pages handler 
const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        pages
        prev
        next
      }
      results {
        id
        name
        image
      }
    }
  }
`;

//filter
function Characters({ filter }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage }
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    //cards
    <div>
      <div className="characters-container">
        {data.characters.results.map((character) => (
          <div key={character.id} className="character-card">
            <div className="image-overlay"></div>
            <img
              src={character.image}
              alt={character.name}
              className="character-image"
            />
            <p>{character.name}</p>
          </div>
        ))}
      </div>
 
        <PaginationComponent
        
          currentPage={currentPage}
          totalPages={data.characters.info.pages}
          onPageChange={handlePageChange}
        />
    
    </div>
  );
}

function App() {
  // the filter
  const [filter, setFilter] = useState({ status: '', species: '', gender: '' });

  const handlerFilterChange = (type, value) => {
    setFilter({ ...filter, [type]: value });
  };

  return (
    <ApolloProvider client={client}>
      <div className="layoutApp">
        <h2 >Rick and Morty</h2>
        <div>
          <h3>Filters</h3>
          {/* 
          <Filter type="status" onChange={handleFilterChange} />
          <Filter type="species" onChange={handleFilterChange} />
          <Filter type="gender" onChange={handleFilterChange} /> */}
        </div>
        <Characters filter={filter} />
      </div>
    </ApolloProvider>
  );
}

export default App;
