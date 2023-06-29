import { Navigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Wilder, { IWilderProps } from "./Wilder";
import AddWilderForm from "./AddWilderForm";

interface ISkillFromAPI {
  id: number;
  name: string;
}

interface IGradeFromAPI {
  grade: number;
  skill: ISkillFromAPI;
}

interface IWilderFromAPI {
  name: string;
  id: number;
  grades: IGradeFromAPI[];
}

const formatWildersFromApi = (wilders: IWilderFromAPI[]): IWilderProps[] =>
  wilders.map((wilder) => {
    return {
      id: wilder.id,
      name: wilder.name,
      skills: wilder.grades.map((grade) => {
        return { votes: grade.grade, title: grade.skill.name };
      }),
    };
  });

export const GET_WILDERS_AND_SKILLS = gql`
  query GetWildersAndSkills {
    wilders {
      id
      name
      grades {
        grade
        skill {
          id
          name
        }
      }
    }
    getAllSkills {
      id
      name
    }
  }
`;

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_WILDERS_AND_SKILLS);

  if (localStorage.getItem("token") === null) {
    return <Navigate to="/login" />;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log(data);
  // console.log(formatWildersFromApi(data.wilders));
  return (
    <div>
      <header>
        <div className="container">
          <h1>Wilders Book reload is working ?</h1>
        </div>
      </header>
      <main className="container">
        <AddWilderForm />
        <h2>Wilders</h2>
        <section className="card-row">
          {formatWildersFromApi(data.wilders).map((wilder) => {
            return (
              <Wilder
                key={wilder.id}
                name={wilder.name}
                id={wilder.id}
                skills={wilder.skills}
              />
            );
          })}
        </section>
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2023 Wild Code School</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
