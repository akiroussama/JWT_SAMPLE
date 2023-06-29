import { gql, useMutation } from "@apollo/client";
import blank_profile from "../assets/profile.png";
import Skill, { ISkillProps } from "./Skill";
import { GET_WILDERS_AND_SKILLS } from "../components/HomePage";

export interface IWilderProps {
  name: string;
  id: number;
  skills: ISkillProps[];
}

const DELETE_WILDER = gql`
  mutation Mutation($deleteWilderId: String!) {
    deleteWilder(id: $deleteWilderId)
  }
`;

const Wilder = ({ name, id, skills }: IWilderProps) => {
  const [deleteWilder, { data, loading, error }] = useMutation(DELETE_WILDER, {
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
    <article className="card">
      <img src={blank_profile} alt="Jane Doe Profile" />
      <h3>{name}</h3>
      <button
        onClick={() => deleteWilder({ variables: { deleteWilderId: id } })}
      >
        Delete
      </button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <h4>Wild Skills</h4>
      <ul className="skills">
        {skills.map((skill) => (
          <Skill key={skill.title} title={skill.title} votes={skill.votes} />
        ))}
      </ul>
    </article>
  );
};

export default Wilder;
