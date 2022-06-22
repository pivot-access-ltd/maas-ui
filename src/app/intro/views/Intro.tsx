import type { ReactNode } from "react";
import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom-v5-compat";

import { useExitURL } from "../hooks";

import ImagesIntro from "./ImagesIntro";
import IncompleteCard from "./IncompleteCard";
import MaasIntro from "./MaasIntro";
import MaasIntroSuccess from "./MaasIntroSuccess";
import UserIntro from "./UserIntro";

import Section from "app/base/components/Section";
import { useCompletedIntro, useCompletedUserIntro } from "app/base/hooks";
import introURLs from "app/intro/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { getRelativeRoute } from "app/utils";

const Intro = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const authLoading = useSelector(authSelectors.loading);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const configLoading = useSelector(configSelectors.loading);
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  const exitURL = useExitURL();
  const viewingUserIntro = location.pathname.startsWith(introURLs.user);
  const showIncomplete = !completedIntro && !isAdmin;

  useEffect(() => {
    if (!authLoading && !configLoading && !showIncomplete) {
      if (completedIntro && completedUserIntro) {
        // If both intros have been completed then exit the flow.
        navigate(exitURL, { replace: true });
      } else if (viewingUserIntro && !completedIntro) {
        // If the user is viewing the user intro but hasn't yet completed the maas
        // intro then send them back to the start.
        navigate(introURLs.index, { replace: true });
      } else if (!viewingUserIntro && completedIntro) {
        // If the user is viewing the maas intro but has already completed it then
        // send them to the user intro.
        navigate(introURLs.user, { replace: true });
      }
    }
  }, [
    navigate,
    authLoading,
    configLoading,
    completedIntro,
    isAdmin,
    completedUserIntro,
    showIncomplete,
    viewingUserIntro,
    exitURL,
  ]);

  let content: ReactNode;
  if (authLoading || configLoading) {
    content = <Spinner text="Loading..." />;
  } else if (showIncomplete) {
    // Prevent the user from reaching any of the intro urls if they are not an
    // admin.
    content = <IncompleteCard />;
  }
  if (content) {
    return <Section>{content}</Section>;
  }
  const base = `${introURLs.index}`;
  return (
    <Routes>
      <Route element={<MaasIntro />} path="/" />
      <Route
        element={<ImagesIntro />}
        path={getRelativeRoute(introURLs.images, base)}
      />
      <Route
        element={<MaasIntroSuccess />}
        path={getRelativeRoute(introURLs.success, base)}
      />
      <Route
        element={<UserIntro />}
        path={getRelativeRoute(introURLs.user, base)}
      />
    </Routes>
  );
};

export default Intro;