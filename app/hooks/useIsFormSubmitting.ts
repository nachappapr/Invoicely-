import { useFormAction, useNavigation } from "@remix-run/react";

/**
 * Custom hook that returns a boolean indicating whether a form submission is in progress.
 * It checks the navigation state and form action to determine if the form is currently being submitted.
 *
 * @returns {boolean} - True if a form submission is in progress, false otherwise.
 */
const useIsFormSubmitting = () => {
  const navigation = useNavigation();
  const formAction = useFormAction();

  const isPending =
    navigation.state !== "idle" &&
    navigation.formAction === formAction &&
    navigation.formMethod === "POST";
  return isPending;
};

export default useIsFormSubmitting;
