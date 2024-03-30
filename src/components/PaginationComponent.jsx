import React from "react";
import Pagination from "react-bootstrap/Pagination";
import '../App.css'

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination>
    <div className="boxPagination">
      <Pagination.Prev
        onClick={handlePrevClick}
        disabled={currentPage === 1}
 
      />
      <div className="pageCurrent">

    <p>Page:</p>
      <Pagination.Item  disabled>{`${currentPage}/${totalPages}`}</Pagination.Item>
      </div>
 
      <Pagination.Next
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      />
    </div>
  </Pagination>
  );
};

export default PaginationComponent;
