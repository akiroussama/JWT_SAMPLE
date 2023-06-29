export interface ISkillProps {
  title: string;
  votes: number;
}

const Skill = ({ title, votes }: ISkillProps) => {
  return (
    <li>
      {title}
      <span className="votes">{votes}</span>
    </li>
  );
};

export default Skill;
