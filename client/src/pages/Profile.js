import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import ThoughtForm from '../components/ThoughtForm';

import Auth from "../utils/auth";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { ADD_FRIEND } from "../utils/mutations";

const Profile = () => {
    const [addFriend] = useMutation(ADD_FRIEND);
    const { username: userParam } = useParams();

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    const user = data?.me || data?.user || {};

    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to='/profile' />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this page. Use the navigation
                links above to sign up or log in!
            </h4>
        );
    }

    const handleClick = async () => {
        try {
            await addFriend({
                variables: { id: user._id },
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-100">
            <div className='flex-column mb-0 pl-3'>
                <h3 className='bg-dark-transparent text-light mb-0 pb-0 display-inline-block'>
                    {user.username}
                </h3>
                <p className="text-tertiary">
                    {user.thoughts.length} thoughts
                </p>
            </div>
            <div className="flex-column mb-0 pl-3 border-bottom">
                <h4 className="text-light">@{user.username}</h4>
                <p><span className="text-light">{user.friendCount}</span> following</p>
            </div>
            <div className='flex-column justify-space-between'>
                <div className='col-12 mb-3 col-lg-8'>
                    <ThoughtList
                        thoughts={user.thoughts}
                    />
                </div>

                {/* <div className='col-12 col-lg-3 mb-3'>
                    <FriendList
                        username={user.username}
                        friendCount={user.friendCount}
                        friends={user.friends}
                    />
                </div> */}
            </div>
        </div>
    );
};

export default Profile;
