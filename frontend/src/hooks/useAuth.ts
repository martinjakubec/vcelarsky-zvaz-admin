import { Context, useContext, useEffect } from "react";
import {
  getLoginToken,
  removeLoginToken,
  setLoginToken,
} from "../utils/localStorageUtils";
import { decodeTokenPayload } from "../utils/decodeTokenPayload";
import { UserContext, UserContextType } from "../App";
import { Navigate, redirect, resolvePath } from "@tanstack/react-router";
import { fetchAPI } from "../utils/fetchAPI";

export function useAuth() {
  const context = useContext(UserContext);

  function handleTokenError() {
    removeLoginToken();
    context.setIsUserLoggedIn(false);
    context.setUsername("");
  }

  useEffect(() => {
    async function verifyToken() {
      const token = getLoginToken();
      if (!token) {
        console.log("no token");
        handleTokenError();
        return;
      }
      try {
        const verifyRequest = await fetchAPI("/verify", {
          method: "POST",
        });
        if (verifyRequest.ok) {
          const response = await verifyRequest.json();
          const decodedToken = decodeTokenPayload(response.token);
          if (decodedToken) {
            setLoginToken(response.token);
            context.setIsUserLoggedIn(true);
            context.setUsername(decodedToken.username);
          } else {
            console.log("token is invalid");
            handleTokenError();
          }
        } else {
          console.log("token is invalid2");
          handleTokenError();
        }
      } catch (err) {
        console.log("token is invalid3");
        handleTokenError();
      }
    }

    verifyToken();
  }, [context]);

  return context;
}
