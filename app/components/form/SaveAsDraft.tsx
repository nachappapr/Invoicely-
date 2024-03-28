import { Form } from "@remix-run/react";

const SaveAsDraft = () => {
  return (
    <Form>
      <button
        className="discardButton"
        type="submit"
        name="intent"
        value="draft"
      >
        cancel
      </button>
    </Form>
  );
};

export default SaveAsDraft;
