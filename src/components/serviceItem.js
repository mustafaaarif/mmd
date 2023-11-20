import React from "react";

function ServiceItem({ itemIcon, itemLink, itemText }) {
  return (
    <li className="py-2 px-4 border-top">
      <div className="d-flex align-items-center">
        <i className={itemIcon} />
        <a href={itemLink} target="_blank" rel="noopener noreferrer" className="ml-3 font-18 font-light">
          {itemText}
        </a>
      </div>
    </li>
  );
}

export default ServiceItem;
