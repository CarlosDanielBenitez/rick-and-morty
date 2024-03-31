import React, { useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery } from "@apollo/client";
import PaginationComponent from "./components/PaginationComponent";
import Skeleton from '@mui/material/Skeleton';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./App.css";

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!, $name: String, $status: String, $species: String, $gender: String) {
    characters(page: $page, filter: { name: $name, status: $status, species: $species, gender: $gender }) {
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



// icon color
const iconColor = {

  width: '100%', // Ancho completo

  '&:hover': {
    backgroundColor: 'transparent', // Fondo transparente al pasar el ratón
  },
  '&:focus': {
    backgroundColor: 'transparent', // Fondo transparente al estar enfocado
    boxShadow: 'none', // Sin sombra
  },
  '& .MuiSelect-root': {
    color: 'white', // Color del texto en blanco

  },
  '& .MuiSelect-icon': {
    color: 'white', // Color del ícono en blanco
  },


}
// all caracters 
function Characters({ searchTerm, statusFilter, speciesFilter, genderFilter }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage, name: searchTerm, status: statusFilter, species: speciesFilter, gender: genderFilter }
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="gridContainer">
        <div className="characters-container">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="character-card">   
            {/* background card */}
              <Skeleton variant="rect" width={180} height={180} />
              <Skeleton />
            </div>
          ))}
        </div>
        <PaginationComponent
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="gridContainer">
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

      {/* all paginations */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={data.characters.info.pages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

function App() {

  // all the constants and search event
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSpeciesChange = (event) => {
    setSpeciesFilter(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGenderFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSpeciesFilter('');
    setGenderFilter('');
  };

  return (
    <ApolloProvider client={client}>
      <div className="layoutApp">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}

          />
          <SearchIcon className="search-icon" sx={{ fontSize: 30 }} />
        </div>
        
          <div className="filterContainer">

            <div className="filterContainerSelect">
            <Select
              sx={iconColor}
              className="filterSelect"
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ 'aria-label': 'status' }}
              IconComponent={ExpandMoreIcon} // Icono del filtro

            >
              <MenuItem value="">Status...</MenuItem>
              <MenuItem value="alive">Alive</MenuItem>
              <MenuItem value="dead">Dead</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>

            <Select
              sx={iconColor}

              className="filterSelect"
              value={speciesFilter}
              onChange={handleSpeciesChange}
              displayEmpty
              inputProps={{ 'aria-label': 'species' }}
              IconComponent={ExpandMoreIcon} // filter icon
            >
              <MenuItem value="">Species...</MenuItem>
              <MenuItem value="human">Human</MenuItem>
              <MenuItem value="alien">Alien</MenuItem>
              <MenuItem value="humanoid">Humanoid</MenuItem>
              <MenuItem value="robot">Robot</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>

            <Select
              sx={iconColor}
              className="filterSelect"
              value={genderFilter}
              onChange={handleGenderChange}
              displayEmpty
              inputProps={{ 'aria-label': 'gender' }}
              IconComponent={ExpandMoreIcon} // filter icon

            >
              <MenuItem value="">Genders...</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="genderless">Genderless</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
            </div>
            <IconButton className="filterReset" onClick={handleResetFilters} aria-label="reset filters">
              <p>Reset filters</p>
            </IconButton>
          </div>
        
        <Characters searchTerm={searchTerm} statusFilter={statusFilter} speciesFilter={speciesFilter} genderFilter={genderFilter} />

      </div>
    </ApolloProvider>
  );
}

export default App;
