import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  GET_USER,
  CLEAR_USERS,
  GET_REPOS,
  SET_LOADING,
} from "../types";

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
}

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  const searchUsers = async (text) => {
    try {
      setLoading();
      const res = await axios.get(
        `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
      );

      dispatch({
        type: SEARCH_USERS,
        payload: res.data.items
      })
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (username) => {
    try {
      setLoading();
      const res = await axios.get(
        `https://api.github.com/users/${username}` //&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(username)
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    } catch (error) {
      console.log(error);
    }
  };

  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  const getRepos = async (username) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc` //&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      dispatch({
        type: GET_REPOS,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setLoading = () => dispatch({type: SET_LOADING})

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState