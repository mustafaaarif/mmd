import React, { useContext } from "react";
import StateContext from '../../utils/context';

const UserCredits = (props) => {
	const { currentUser } = useContext(StateContext);
	const { credits } = currentUser;
    return (
		<>
            <div className="d-flex p-2">
                <i className="mdi mdi-coin" style={{fontSize: '20px', color: "#ffffff", marginTop: "3px"}}></i>
                <div className="mt-1" style={{color: "#ffffff", fontSize: "18px", fontStyle: "normal", fontWeight: "bold"}}>&nbsp;{credits} {credits<=1? 'Credit' : 'Credits' }</div>
            </div>
        </>
    );
}

export default UserCredits;
