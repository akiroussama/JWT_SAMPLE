import { useState } from "react";

import { useMutation, gql } from "@apollo/client";
import { GET_WILDERS_AND_SKILLS } from "../components/HomePage";

const ADD_WILDER = gql`
  mutation Mutation($name: String!) {
    addWilder(name: $name) {
      id
      name
    }
  }
`;

const AddWilderForm = () => {
  const [wilderName, setName] = useState("");
  const [addNewWilder, { data, error, loading }] = useMutation(ADD_WILDER, {
    refetchQueries: [GET_WILDERS_AND_SKILLS],
  });
  if (loading) {
    return <p>Loading</p>;
  }
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }
  console.log(data);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        addNewWilder({ variables: { name: wilderName } });
      }}
    >
      <h3>Add Wilder</h3>
      <label>Name </label>
      <input
        value={wilderName}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <button>Submit</button>
    </form>
  );
};

export default AddWilderForm;
