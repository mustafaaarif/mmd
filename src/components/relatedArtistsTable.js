import React, { useState } from "react";
import { Progress, Alert } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import PerfectScrollbar from 'react-perfect-scrollbar';
import ModalConfirm from "./modalConfirm";
import TableModal from "./tableModal";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


const RelatedArtistsTable = ({ relatedArtistsData }) => {

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [forceUpdate, setForce] = useState(1);
  const [errorMsg, setErrorMsg] = useState("Something went wrong! Please refresh page and try again!");
  const [openModal, setToggleModal] = useState(false);
  const [openDeleteModal, setToggleDeleteModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteId, setDeleteID] = useState(null);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

  const addToWishlist = (artist) => {
    let wishlistData = {
      name: artist.name,
      spotify_identifier: artist.id,
      followers: artist.followers? artist.followers.total: 0,
      popularity: artist.popularity? artist.popularity: 0,
      image_big: artist.images.length? artist.images[0].url: "",
      image_small: artist.images.length? artist.images[2].url: ""
    };
    setDataModal(wishlistData);
    setToggleModal(true);
  };

  const removeFromWishlist = (artistWishlistId, artist) => {
    let wishlistData = {
      name: artist.name,
      spotify_identifier: artist.id,
      followers: artist.followers? artist.followers.total: 0,
      popularity: artist.popularity? artist.popularity: 0,
      image_big: artist.images.length? artist.images[0].url: "",
      image_small: artist.images.length? artist.images[2].url: ""
    };
    setDataModal(wishlistData);
    setDeleteID(artistWishlistId);
    setToggleDeleteModal(true);
  };


  const nameFormatter = (cell, row) => {
    let artistImage = row.images[2];
    return (
      <div className="flexContainer">
        {artistImage ? (
          <img
            src={artistImage.url}
            alt={cell}
            width="50"
            height="50"
            className="rounded-circle"
          />
        ): (
            <i className="artist-avatar">{cell.charAt(0).toUpperCase()}</i>
        )}
        <span className="fontWeight700">{cell}</span>
      </div>
    );
  };

  const popularityPctFormatter = (cell, row) => {
    const popularityPct = row.popularity;
    return (
      <div>
        <p className="fontWeight700">{popularityPct} %</p>
        <Progress color="success" value={popularityPct} /> 
      </div>
    );
  };

  const followersFormatter = (cell, row) => {
    return <b>{cell? Number(cell).toLocaleString({minimumFractionDigits: 0}): "N/A"}</b>
  };

  const genresFormatter = (cell, row) => {
    let formattedGenres = [];
    cell.map(genre => {
        formattedGenres.push(genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase()));
    })
    return formattedGenres.length? formattedGenres.join(", "): "Not Available";
  };

  const actionFormatter = (cell, row) => {
    let artist_wishlist_id = row.artist_wishlist;
    let wishlist_icon = artist_wishlist_id ? "mdi mdi-heart": "mdi mdi-heart-outline";

    return (
      <i className={`ml-2 text-danger wishlist-icon ${wishlist_icon}`} style={{fontSize: "30px"}}
        onClick={() => {
         artist_wishlist_id ? removeFromWishlist(artist_wishlist_id, row): addToWishlist(row);
        }}
      ></i>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Artist",
      formatter: nameFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "followers.total",
      text: "Followers",
      formatter: followersFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "40px" };
      }
    },
    {
      dataField: "popularity",
      text: "Popularity (%)",
      formatter: popularityPctFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "genres",
      text: "Genres",
      formatter: genresFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "wishlist",
      text: "Wishlist",
      sort: false,
      formatter: actionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "5px" };
      }
    },
  ];

  return (
    <>
      {
        <div>
            {success ? window.location.reload() : null}
            {errorPut && (
              <Alert color="danger">
                {errorMsg}
              </Alert>
            )}
        </div>
      }
      <PerfectScrollbar>
        <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 450 }}>
          <ToolkitProvider
            keyField="name"
            data={relatedArtistsData}
            columns={columns}
          >
          {props => (
            <div>
              <BootstrapTable
                {...props.baseProps}
                bordered={ false }
                remote={ { sort: false } }
              />
            </div>
          )}
          </ToolkitProvider>
        </div>
      </PerfectScrollbar>
      <ModalConfirm
        openModal={openModal}
        setToggleModal={setToggleModal}
        dataModal={dataModal}
        title={dataModal ? `Add Artist ${dataModal.name} To Wishlist`: 'Add Artist To Wishlist'}
        setSuccess={setSuccess}
        setError={setError}
        body={dataModal? `Are you sure that you want to add artist ${dataModal.name} to your wishlist?`: 'Are you sure that you want to add this artist to your wishlist?'}
        apiURL={`artist-wishlist`}
        successMsg={'Artist added to wishlist!'}
      />
      <TableModal
          openModal={openDeleteModal}
          setToggleModal={setToggleDeleteModal}
          values={handlerValues}
          title={dataModal ? `Remove Artist ${dataModal.name} From Wishlist`: 'Remove Artist From Wishlist'}
          body={dataModal? `Are you sure that you want to remove artist ${dataModal.name} from your wishlist?`: 'Are you sure that you want remove this artist from your wishlist?'}
          apiURL={`artist-wishlist/${deleteId}/`}
          bodyID={deleteId}
          can_be_deleted={true}
          deleteBody={true}
        />
    </>
  );
};

export default RelatedArtistsTable;