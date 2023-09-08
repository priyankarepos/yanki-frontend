import ProfielCircle from "../ProfileCircle";

const UserPageLayout = ({ children }) => {
  return (
    <>
      <ProfielCircle />
      {children}
    </>
  );
};

export default UserPageLayout;
