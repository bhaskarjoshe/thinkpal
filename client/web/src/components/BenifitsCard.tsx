type BenifitsCardProps = {
    icon?: React.ReactNode;
    title: string;
    description: string;
  };
  
  const BenifitsCard = ({ icon, title, description }: BenifitsCardProps) => {
    return (
      <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        {icon && <div className="text-indigo-600 mb-4">{icon}</div>}
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    );
  };
  
  export default BenifitsCard;
  