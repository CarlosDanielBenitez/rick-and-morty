import React, { useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";
import PaginationComponent from "./components/PaginationComponent";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "@mui/material/Modal"; // Importar componente Modal de Material-UI
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./App.css";
import SearchBar from "./components/SearchBar";
import CloseIcon from "@mui/icons-material/Close";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

const GET_CHARACTERS = gql`
  query GetCharacters(
    $page: Int!
    $name: String
    $status: String
    $species: String
    $gender: String
  ) {
    characters(
      page: $page
      filter: {
        name: $name
        status: $status
        species: $species
        gender: $gender
      }
    ) {
      info {
        pages
        prev
        next
      }
      results {
        id
        name
        image
        status
        gender
        species
        type
        location {
          name
          dimension
        }
        origin {
          name
        }
      }
    }
  }
`;

// icon color styles
const iconColor = {
  width: "100%", // Ancho completo

  "&:hover": {
    backgroundColor: "transparent", // Fondo transparente al pasar el ratón
  },
  "&:focus": {
    backgroundColor: "transparent", // Fondo transparente al estar enfocado
    boxShadow: "none", // Sin sombra
  },
  borderRadius: ".8rem",
  fontSize: "14px",
  "& .MuiInputBase-input, & .MuiSvgIcon-root": {
    color: "white",
  },
};

function CharacterDetails({ character, onClose }) {
  return (
    <Modal open={!!character} onClose={onClose}>
      <Box
        className="charactersDetailsImgContainer"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "none",
          boxShadow: 24,
         
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 15,
            borderRadius: "50%",
            backgroundColor: "gray",
            color: "black",
            padding: "2px",
            "&:hover": { backgroundColor: "gray" },
          }}
          onClick={onClose}
        >
          <CloseIcon sx={{ width: ".9rem", height: ".9rem" }} />
        </IconButton>

        <div className="charactersDetailsImg">
          <img src={character?.image} alt={character?.name} />
        </div>
        <div className="charactersDetails">
          <Typography
            variant="h6"
            fontWeight={700}
            paddingTop={2}
            gutterBottom
            component="div"
          >
            {character?.name}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Status:</span> {character?.status}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Gender:</span>
            {character?.gender}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Species:</span> {character?.species}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Type:</span> {character?.type || "Unknown"}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Location</span> {character?.location?.name || "Unknown"}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Origin:</span> {character?.origin?.name || "Unknown"}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <span>Dimension:</span>{" "}
            {character?.location?.dimension || "Unknown"}
          </Typography>
        </div>
      </Box>
    </Modal>
  );
}

function Characters({ searchTerm, statusFilter, speciesFilter, genderFilter }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Estado para el personaje seleccionado

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      page: currentPage,
      name: searchTerm,
      status: statusFilter,
      species: speciesFilter,
      gender: genderFilter,
    },
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="gridContainer">
      <div className="characters-container">
        {loading ? (
          [...Array(20)].map((_, index) => (
            <div key={index} className="character-card">
              <Skeleton variant="rectangular" width={180} height={180} />
              <Skeleton />
            </div>
          ))
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          data.characters.results.map((character) => (
            <div
              key={character.id}
              className="character-card"
              onClick={() => handleCharacterClick(character)}
            >
              <div className="image-overlay"></div>
              <img
                src={character.image}
                alt={character.name}
                className="character-image"
              />
              <p>{character.name}</p>
            </div>
          ))
        )}
      </div>

{/* Button Paginations Component */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={data?.characters?.info?.pages}
        onPageChange={handlePageChange}
      />


{/* Personajes Component */}
      <CharacterDetails
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  );
}

function App() {
  // search hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

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
    setSearchTerm("");
    setStatusFilter("");
    setSpeciesFilter("");
    setGenderFilter("");
  };

  return (
    <ApolloProvider client={client}>
      <div className="layoutApp">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <div className="filterContainer">
          <div className="filterContainerSelect">
            <Select
              sx={iconColor}
              className="filterSelect"
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ "aria-label": "status" }}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value="">Status...</MenuItem>
              <MenuItem value="alive">Alive</MenuItem>
              <MenuItem value="dead">Dead</MenuItem>
            </Select>
            <Select
              sx={iconColor}
              className="filterSelect"
              value={speciesFilter}
              onChange={handleSpeciesChange}
              displayEmpty
              inputProps={{ "aria-label": "species" }}
              IconComponent={ExpandMoreIcon}
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
              inputProps={{ "aria-label": "gender" }}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value="">Genders...</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="genderless">Genderless</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </div>
          <div className="filterContainerReset">
            <IconButton
              sx={{ padding: "0" }}
              onClick={handleResetFilters}
              aria-label="reset filters"
            >
              <p>Reset filters</p>
            </IconButton>
          </div>
        </div>
        <Characters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          speciesFilter={speciesFilter}
          genderFilter={genderFilter}
        />
      </div>
    </ApolloProvider>
  );
}

export default App;
