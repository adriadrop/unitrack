import React from "react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import chad from './media/Chad.jpg' 
import Loading from './Loading'

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <div>
        <img height="500" src={chad} alt={user.name} />
        <h2>Chad {user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});