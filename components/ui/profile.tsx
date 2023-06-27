import { FC } from "react";
import imageProfile from "../../public/profile.png"; // Tell webpack this JS file uses this image
import Window from "./window";

type ProfileProps = {
  onClose: () => void;
};

const Profile: FC<ProfileProps> = ({ onClose }) => {
  return (
    <Window
      title={"Hello! Welcome to my portfolio!"}
      //   iconSrc={iconProfile.src}
      windowWidth={300}
      initialPosition={{
        x: 10,
        y: 10,
      }}
      onClose={onClose}
    >
      <div className="flex">
        <div className="flex-1">
          <p className="mb-1">
            I'm Joaquín, I've love technology and this website my little way to
            show that to you!
          </p>
          <p className="mb-1">
            I've been working on software engineering for over 10 years . I've
            the privilege of been exposed to various web development
            technologies like Next.js, Svelte and many others. In my free time I
            co-organize our local JS monthly meetups, create robots and drones
            🤖
          </p>
          <p>Do you Believe?</p>
        </div>
        <pre
          className="flex-1"
          style={{
            imageRendering: "pixelated",
            backgroundImage: `url(${imageProfile.src})`,
            backgroundSize: "cover",
          }}
        ></pre>
      </div>
    </Window>
  );
};

export default Profile;
