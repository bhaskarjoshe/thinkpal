type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button className=" bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg  hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 cursor-pointer" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
