import "./techStackSliderCard.css";

interface techStackSliderCardProps {
  keyIndex: number;
  imageUrl: string;
  text: string;
  alt: string;
  id: number;
}

const TechStackSliderCard: React.FC<techStackSliderCardProps> = ({
  keyIndex,
  imageUrl,
  text,
  alt,
  id,
}) => {
  return (
    <div
      className="stack-component"
      key={keyIndex}
      style={{ "--position": id } as React.CSSProperties}
    >
      <div className="stack-component-bg">
        <img
          style={{ width: "1.2rem", height: "1.2rem" }}
          src={imageUrl}
          alt={alt}
        />
      </div>

      <div className="stack-component-txt">{text}</div>
    </div>
  );
};

export default TechStackSliderCard;
