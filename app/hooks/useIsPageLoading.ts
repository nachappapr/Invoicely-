import { useLocation, useNavigation } from "@remix-run/react";

/**
 * Custom hook that determines if the current page is in a loading state.
 *
 * @returns {boolean} - Returns `true` if the current page is loading, otherwise `false`.
 */
const useIsPageLoading = () => {
  const navigation = useNavigation();
  const location = useLocation();

  return (
    navigation.state === "loading" &&
    navigation.location.pathname === location.pathname
  );
};

export default useIsPageLoading;
