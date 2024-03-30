import React from "react";
import Pagination from "react-bootstrap/Pagination";
import '../App.css'

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  
    

  //prev btn 
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

    //next btn 
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination >
      <div className="boxPagination">
      <Pagination.Item 
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className="pagePrev"
        >
          Prev
        </Pagination.Item>

        <div className="pageCurrent">
          <p>Page:</p>
          <div className="currentPageNumber">{currentPage}</div>
          <p>/{totalPages}</p>
        </div>

        <Pagination.Item

          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className="pageNext"
        >Next
        </Pagination.Item>
      </div>
    </Pagination>
  );
};

export default PaginationComponent;
