import { useContext } from 'react';
import { DropdownItem } from 'reactstrap';
import { List } from 'react-feather';
import user1 from '../../assets/images/users/user1.jpg';
import { Link } from 'react-router-dom';
import StateContext from '../../utils/context';

const ProfileDD = () => {
  const { currentUser } = useContext(StateContext);
  const { first_name, last_name, profile_image, email } = currentUser;
  return (
    <div>
      <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
        <img src={profile_image ? Object.keys(profile_image).length > 0 ? profile_image.thumb_small : user1 : user1} alt="user" className="rounded-circle" width="60" />
        <span>
          <h6 className="mb-0">{first_name} {last_name}</h6>
          <small>{email}</small>
        </span>
      </div>
      <Link to="/labels" className='text-decoration-none text-body'>
        <DropdownItem className="px-4 py-3">
          <List size={20} />
          &nbsp; My Lables
        </DropdownItem>
      </Link>
      {
        !currentUser.is_sub_user &&
        <Link to="/statements" className='text-decoration-none text-body'>
          <DropdownItem className="px-4 py-3">
            <i className="bi bi-wallet"></i>
            &nbsp; Financial Statements
          </DropdownItem>
        </Link>
      }
      {
        !currentUser.is_sub_user &&
        <Link to="/invoices" className='text-decoration-none text-body'>
          <DropdownItem className="px-4 py-3">
            <i className="bi bi-receipt"></i>
            &nbsp; Invoices
          </DropdownItem>
        </Link>
      }
      <Link to="/payment-methods" className='text-decoration-none text-body'>
        <DropdownItem className="px-4 py-3">
          <i className="bi bi-credit-card"></i>
          &nbsp; Payment Methods
        </DropdownItem>
      </Link>
      {/* <DropdownItem divider /> */}
      <Link to="/purchase-history" className='text-decoration-none text-body'>
        <DropdownItem className="px-4 py-3">
          <i className="bi bi-cart"></i>
          &nbsp; Purchase History
        </DropdownItem>
      </Link>
      <DropdownItem divider />
    </div>
  );
};

export default ProfileDD;
