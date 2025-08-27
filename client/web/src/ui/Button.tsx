type ButtonProps = {
  children: React.ReactNode;
};

const Button = ({ children }: ButtonProps) => {
  return (
    <button className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg  hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300">
      {children}
    </button>
  );
};

export default Button;
