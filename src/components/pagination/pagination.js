import React, {useState} from 'react';
import ReactPaginate from 'react-paginate';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const Pagination = (props) => {
  const {pageSize, setPageSize, dataCount, setCurrentPage, currrentPage} =  props.pagination;
  const [dropdownOpen, setOpen] = useState(false);


  const handlePageSize = (e) => {
    setCurrentPage(1)
    setPageSize(e);
  }

  return (
    <div className="pagination_outer">
    <ButtonDropdown isOpen={dropdownOpen} toggle={() => setOpen(prev => !prev)}>
      <DropdownToggle caret color="primary">
        {pageSize}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handlePageSize(1)}>1</DropdownItem>
        <DropdownItem onClick={() => handlePageSize(2)}>2</DropdownItem>
        <DropdownItem onClick={() => handlePageSize(5)}>5</DropdownItem>
        <DropdownItem onClick={() => handlePageSize(25)}>25</DropdownItem>
        <DropdownItem onClick={() => handlePageSize(50)}>50</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>

    <ReactPaginate
        previousLabel={'‹'}
        nextLabel={'›'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.floor((dataCount + pageSize - 1) / pageSize)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        forcePage={currrentPage - 1}
        onPageChange={e => setCurrentPage(e.selected + 1)}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
      />

    </div>
  );
};

export default Pagination;