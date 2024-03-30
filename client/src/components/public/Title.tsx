interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return (
    <div className="generalTitle">
      {text}
    </div>
  );
};

export default Title;
